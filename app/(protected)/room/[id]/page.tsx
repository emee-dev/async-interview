"use client";

import { GenerateReport } from "@/app/api/route";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANGUAGES, SNIPPETS } from "@/consts";
import { useSuperVizContext } from "@/context";
import { api } from "@/convex/_generated/api";
import { toast, useToast } from "@/hooks/use-toast";
import { oneDark } from "@codemirror/theme-one-dark";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useSuperviz, useVideo } from "@superviz/react-sdk";
import { useMutation } from "@tanstack/react-query";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import axios from "axios";
import {
  useMutation as convexUseMutation,
  useConvex,
  useQuery,
} from "convex/react";
import { Loader, Play, Save } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";

type PistonResponse = {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: any;
    output: string;
  };
  compile: {
    stdout: "";
    stderr: "";
    code: 0;
    signal: null;
    output: "";
  };
};

type PistonArgs = {
  language: string;
  version: string;
  files: [
    {
      content: string;
    },
  ];
  stdin?: "";
  args?: string[];
  compile_timeout?: 10000;
  run_timeout?: 3000;
  compile_memory_limit?: -1;
  run_memory_limit?: -1;
};

type LanguageTypes = keyof typeof LANGUAGES;

type ComponentProps = {
  params: { id: string | null };
  searchParams: {};
};

const customTheme = EditorView.theme({
  "&": {
    fontSize: "14px",
    fontFamily: "'Fira Code', monospace",
  },
  ".cm-scroller": {
    lineHeight: "1.5",
  },
});

export default function AsyncInterviewRoom({ params }: ComponentProps) {
  const { getUser, isLoading, isAuthenticated } = useKindeBrowserClient();
  const [givenName, setGivenName] = useState<string | null>(null);
  const [userType, setUserType] = useState<
    "interviewer" | "interviewee" | null
  >(null);

  const context = useSuperVizContext();
  const superviz = useSuperviz();
  const { isReady } = useVideo();

  const roomData = useQuery(
    api.interview.getRoomById,
    params.id ? { roomId: params.id } : "skip"
  );

  useLayoutEffect(() => {
    if (params.id && givenName) {
      const group = {
        id: `group-Interview`,
        name: `group-Interview`,
      };

      context.setRoomId(params.id);
      context.setGroup(group);
      context.setParticipant({
        id: givenName,
        name: givenName,
      });
      context.setIsVideoEnabled(true);
    }
  }, [params, givenName]);

  // initialise the video call
  useEffect(() => {
    if (context.roomId && context.group) {
      superviz.startRoom();
    }
  }, [context]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && roomData) {
      const user = getUser();

      if (user && user.email) {
        const userEmail = user.email;
        const givenName = user.given_name;

        setGivenName(givenName || "");

        const interviewer = roomData.interviewer.email;
        const interviewee = roomData.interviewee.email;

        if (interviewer === userEmail) {
          setUserType("interviewer");
        } else if (interviewee === userEmail) {
          setUserType("interviewee");
        } else {
          setUserType(null);
        }
      }
    }
  }, [isLoading, isAuthenticated, roomData]);

  if (!params.id) {
    return notFound();
  }

  // if kinde is loading user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <div>Verifying user, please hold on.</div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center pt-32">
        <div>Intializing video feed, please hold on.</div>
      </div>
    );
  }

  return (
    <>
      {userType === "interviewer" && <InterviewerView roomId={params.id} />}
      {userType === "interviewee" && <IntervieweeView roomId={params.id} />}
    </>
  );
}

function InterviewerView({ roomId }: { roomId: string }) {
  const { toast } = useToast();
  const queryCodeEditor = useQuery(api.code_editor.queryCodeEditor, { roomId });
  const { toggleRecording, hangUp } = useVideo();
  const superviz = useSuperviz();
  const convex = useConvex();

  const updateRoom = useMutation({
    mutationKey: ["update_room"],
    mutationFn: async (args: {
      roomId: string;
      status: "in-progress" | "concluded";
    }) => {
      try {
        const res = await convex.mutation(api.interview.updateRoomState, args);

        if (!res) {
          throw new Error("Unable to update room status, try again.");
        }

        toast({
          title: "Interview status",
          description:
            args.status === "in-progress"
              ? "Interview has started and room is recorded."
              : "Interview has ended, thanks for today.",
        });
        return Promise.resolve(res);
      } catch (error: any) {
        toast({
          title: "Interview status",
          description: error.message,
        });
      }
    },
  });

  const endInterview = useMutation({
    mutationKey: ["end_interview"],
    mutationFn: async (args: GenerateReport) => {
      try {
        hangUp();
        superviz.stopRoom();

        const req = await axios.put("/api", args);

        const res = req.data as { message: string };

        updateRoom.mutate({
          roomId,
          status: "concluded",
        });

        toast({
          title: "Scheduled results",
          description: "Processing results, it will take some time.",
        });

        return Promise.resolve(res);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          toast({
            title: "Uh oh! Something went wrong.",
            description: err.response?.data.message,
          });

          return Promise.reject(err.response?.data);
        } else {
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
          return Promise.reject(err.message);
        }
      }
    },
  });

  return (
    <div className="h-screen font-geistMono flex flex-col bg-background text-foreground">
      <nav className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Async Interview</h1>
        <div className="flex items-center gap-x-2">
          {!updateRoom.isPending && (
            <Button
              variant="secondary"
              size={"sm"}
              onClick={async () => {
                toggleRecording();
                updateRoom.mutate({
                  roomId,
                  status: "in-progress",
                });
              }}
            >
              <Play className="mr-1 size-4" /> Begin Interview
            </Button>
          )}

          {updateRoom.isPending && (
            <Button variant="secondary" size={"sm"} disabled>
              <Loader className="mr-1 size-4 animate-spin" /> Initiating
            </Button>
          )}

          {!endInterview.isPending && (
            <Button
              variant="destructive"
              size={"sm"}
              onClick={async () => {
                endInterview.mutate({ roomId });
              }}
            >
              <Save className="mr-1 size-4" /> End Interview
            </Button>
          )}

          {endInterview.isPending && (
            <Button variant="destructive" disabled size={"sm"}>
              <Loader className="mr-1 size-4 animate-spin" /> Terminating
            </Button>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow flex w-screen overflow-hidden">
        <div className="flex-grow flex w-screen overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full p-2 overflow-auto">
            <Card className="h-full w-full bg-muted p-2 flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <Select value={queryCodeEditor?.language} disabled>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(LANGUAGES).map((item) => (
                      <SelectItem value={item} key={item}>
                        {item.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-grow bg-background rounded-md p-2 overflow-auto">
                <Suspense fallback={<div>Loading...</div>}>
                  <CodeMirror
                    width="100%"
                    height="100%"
                    theme={[oneDark, customTheme]}
                    editable={false}
                    value={queryCodeEditor?.code}
                    extensions={[
                      loadLanguage(
                        // @ts-expect-error typeerror
                        queryCodeEditor?.language || "javascript"
                      ) as any,
                    ]}
                    className="text-base h-full w-full"
                  />
                </Suspense>
              </div>
            </Card>
            <Card className="h-full bg-muted p-2 border border-blue-400">
              <Tabs
                defaultValue="stdout"
                value={queryCodeEditor?.activeTab}
                className="h-full"
              >
                <TabsList>
                  <TabsTrigger
                    value="stdout"
                    className="border data-[state=active]:border-black"
                  >
                    stdout
                  </TabsTrigger>
                  <TabsTrigger
                    value="stderr"
                    className="border data-[state=active]:border-black"
                  >
                    stderr
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="stdout" className="flex-grow">
                  <div className="h-full bg-background rounded-md p-2 overflow-auto">
                    <pre className="text-sm">{queryCodeEditor?.stdOut}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="stderr" className="flex-grow">
                  <div className="h-full bg-background rounded-md p-2 overflow-auto">
                    <pre className="text-sm text-red-500">
                      {queryCodeEditor?.stdErr}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntervieweeView({ roomId }: { roomId: string }) {
  const [stdOut, setStdOut] = useState("");
  const [stdErr, setStdError] = useState("");
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<LanguageTypes>("javascript");
  const [activeTab, setActiveTab] = useState<"stdout" | "stderr">("stdout");

  const mutateCodeEditor = convexUseMutation(api.code_editor.mutateCodeEditor);

  const roomData = useQuery(
    api.interview.getRoomById,
    roomId ? { roomId } : "skip"
  );

  const { isPending, error, data, mutate } = useMutation({
    mutationKey: ["execute_code"],
    mutationFn: async (args: PistonArgs) => {
      try {
        const req = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          args
        );

        const res = req.data as PistonResponse;

        return Promise.resolve(res);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          return Promise.reject(err.response?.data);
        } else {
          return Promise.reject(err.message);
        }
      }
    },
  });

  // Edge case: avoid updating the editor state on initial render
  useEffect(() => {
    async function updateEditor() {
      await mutateCodeEditor({
        code,
        activeTab,
        language,
        roomId,
        stdErr,
        stdOut,
      });
    }

    if (roomData && roomData.status === "in-progress") {
      updateEditor();
    }
  }, [roomData, language, stdOut, stdErr, code, activeTab]);

  useEffect(() => {
    setCode(SNIPPETS[language]);
  }, [language]);

  useEffect(() => {
    if (data) {
      const stdErr = data.run.stderr;
      const stdOut = data.run.stdout;

      setStdError(stdErr);
      setStdOut(stdOut);

      if (stdErr && stdErr.length > 0) {
        setActiveTab("stderr");
      }

      if ((stdOut && !stdErr) || stdErr.length === 0) {
        setActiveTab("stdout");
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Code error",
        description: `Error: ${error?.message}`,
      });
    }
  }, [error]);

  return (
    <div className="h-screen font-geistMono flex flex-col bg-background text-foreground">
      <nav className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Async Interview</h1>
        <div className="flex items-center gap-x-2">
          {roomData?.status !== "in-progress" && (
            <div className="text-base text-red-400">
              Interview has not started.
            </div>
          )}

          {roomData?.status === "in-progress" && (
            <div className="text-base text-green-400">
              Interview in progress
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow flex w-screen overflow-hidden">
        <div className="flex-grow flex w-screen overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full p-2 overflow-auto">
            <Card className="h-full w-full bg-muted p-2 flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <Select
                  value={language}
                  disabled={roomData?.status === "in-progress" ? false : true}
                  onValueChange={(value: LanguageTypes) => setLanguage(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(LANGUAGES).map((item) => (
                      <SelectItem value={item} key={item}>
                        {item.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!isPending && (
                  <Button
                    disabled={roomData?.status === "in-progress" ? false : true}
                    onClick={() => {
                      mutate({
                        files: [
                          {
                            content: code,
                          },
                        ],
                        language,
                        version: LANGUAGES[language],
                      });
                    }}
                    size={"sm"}
                  >
                    Execute
                  </Button>
                )}
                {isPending && (
                  <Button disabled size={"sm"}>
                    Evaluating <Loader className="ml-1 size-4 animate-spin" />
                  </Button>
                )}
              </div>
              <div className="flex-grow bg-background rounded-md p-2 overflow-auto">
                <Suspense fallback={<div>Loading...</div>}>
                  <CodeMirror
                    width="100%"
                    height="100%"
                    theme={[oneDark, customTheme]}
                    value={code}
                    editable={roomData?.status !== "in-progress" ? false : true}
                    extensions={[loadLanguage(language) as any]}
                    onChange={(code) => setCode(code)}
                    className="text-base h-full w-full"
                  />
                </Suspense>
              </div>
            </Card>
            <Card className="h-full bg-muted p-2 border border-blue-400">
              <Tabs defaultValue="stdout" value={activeTab} className="h-full">
                <TabsList>
                  <TabsTrigger
                    value="stdout"
                    className="border data-[state=active]:border-black"
                  >
                    stdout
                  </TabsTrigger>
                  <TabsTrigger
                    value="stderr"
                    className="border data-[state=active]:border-black"
                  >
                    stderr
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="stdout" className="flex-grow">
                  <div className="h-full bg-background rounded-md p-2 overflow-auto">
                    <pre className="text-sm">{stdOut}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="stderr" className="flex-grow">
                  <div className="h-full bg-background rounded-md p-2 overflow-auto">
                    <pre className="text-sm text-red-500">{stdErr}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

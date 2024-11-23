"use client";

import { Button } from "@/components/ui/button";
import { useSuperVizContext } from "@/context";
import { generateId } from "@/lib/utils";
import { useSuperviz, useVideo } from "@superviz/react-sdk";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, SNIPPETS } from "@/consts";
import CodeMirror, { EditorView, Extension } from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  loadLanguage,
  langNames,
  langs,
} from "@uiw/codemirror-extensions-langs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { notFound } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

// const Chat = dynamic(() => import("@/components/chat"), {
//   ssr: false,
// });

// export default function App() {
//   const context = useSuperVizContext();
//   const superviz = useSuperviz();
// const video = useVideo()

//   useEffect(() => {
//     if (context) {
//       const group = {
//         id: `group-Interview`,
//         name: `group-Interview`,
//       };

//       context.setRoomId("DEMO_ROOM");
//       context.setGroup(group);
//     }
//   }, []);

//   return (
//     <div className="w-screen">
//       <Button
//         onClick={() => {
//           const participant = {
//             id: `participant-User1`,
//             name: `participant-User1`,
//           };

//           context.setParticipant(participant);
//         }}
//       >
//         Join as User1
//       </Button>
//       <Button
//         onClick={() => {
//           const participant = {
//             id: `participant-User2`,
//             name: `participant-User2`,
//           };

//           context.setParticipant(participant);
//         }}
//       >
//         Join as User2
//       </Button>

//       <Button
//         onClick={() => {
//           superviz.startRoom();
//           context.setIsVideoEnabled(true);
//         }}
//       >
//         Start Room
//       </Button>

//       <Button onClick={async () => {}}>Get Recordings</Button>
//     </div>
//   );
// }

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

export default function AsyncInterviewRoom({ params }: ComponentProps) {
  const [language, setLanguage] = useState<LanguageTypes>("javascript");
  const [stdOut, setStdOut] = useState("");
  const [stdErr, setStdError] = useState("");
  const [code, setCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"stdout" | "stderr">("stdout");
  const [userType, setUserType] = useState<
    "interviewer" | "interviewee" | null
  >(null);

  const { getUser, isLoading, isAuthenticated } = useKindeBrowserClient();

  // const queryCodeEditor = useQuery()
  // const mutateCodeEditor = useMutation()

  const roomData = useQuery(
    api.interview.getRoomById,
    params.id ? { roomId: params.id } : "skip"
  );

  // get user email
  useEffect(() => {
    if (!isLoading && isAuthenticated && roomData) {
      const user = getUser();

      if (user && user.email) {
        const userEmail = user.email;

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

  const customTheme = EditorView.theme({
    "&": {
      fontSize: "14px",
      fontFamily: "'Fira Code', monospace",
    },
    ".cm-scroller": {
      lineHeight: "1.5",
    },
  });

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
        variant: "default",
        description: `System Error: ${error.message}`,
      });
    }
  }, [error]);

  if (!params.id) {
    return notFound();
  }

  // TODO find a way to lock typing on the editor unless interview has started.

  return (
    <div className="h-screen font-geistMono flex flex-col bg-background text-foreground">
      <nav className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Async Interview</h1>
        <Button variant="secondary" size={"sm"}>
          <Save className="mr-1 size-4" /> Save Code
        </Button>
      </nav>

      {/* Main content */}
      <div className="flex-grow flex w-screen overflow-hidden">
        <div className="flex-grow flex w-screen overflow-hidden">
          <div className="grid grid-cols-2 w-full p-2 overflow-auto">
            <Card className="h-full w-full bg-muted p-2 flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <Select
                  value={language}
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

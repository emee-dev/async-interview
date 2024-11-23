"use client";

import { CreateReport } from "@/app/api/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { generateId } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useConvex, usePaginatedQuery } from "convex/react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Menu, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  position: z.string().min(1),
  intervieweeEmail: z.string().min(1),
});

export default function InterviewDashboard() {
  const convex = useConvex();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { getUser, isLoading, isAuthenticated } = useKindeBrowserClient();

  const { results, status, loadMore } = usePaginatedQuery(
    api.interview.getRoomsByEmail,
    userEmail !== null ? { email: userEmail } : "skip",
    { initialNumItems: 5 }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      intervieweeEmail: "",
      position: "",
    },
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const user = getUser();

      if (user && user.email) {
        setUserEmail(user.email);
      }
    }
  }, [isLoading, isAuthenticated]);

  const { isPending, mutate, error } = useMutation({
    mutationKey: ["create_interview"],
    mutationFn: async (args: {
      interviewerEmail: string | null;
      intervieweeEmail: string;
      position: string;
    }) => {
      try {
        if (!args.interviewerEmail) {
          return Promise.reject("Authentication error, please login.");
        }

        const [interviewer, interviewee] = await Promise.all([
          convex.query(api.interview.getUserByEmail, {
            email: args.interviewerEmail,
          }),

          convex.query(api.interview.getUserByEmail, {
            email: args.intervieweeEmail,
          }),
        ]);

        if (!interviewer) {
          return Promise.reject(
            new Error("Interviewer does not exist, please login.")
          );
        }

        if (!interviewee) {
          return Promise.reject(
            new Error("Interviewee does not exist. Verify email.")
          );
        }

        const createRoomArgs: CreateReport = {
          position: args.position,
          roomId: generateId(7),
          interviewer: {
            email: interviewer.email,
            first_name: interviewer.first_name,
          },
          interviewee: {
            email: interviewee.email,
            first_name: interviewee.first_name,
          },
        };

        const req = await axios.post("/api", createRoomArgs);

        const res = req.data as { message: string };

        return Promise.resolve(res.message);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          return Promise.reject(err.response?.data.message);
        } else {
          return Promise.reject(err.message);
        }
      }
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    mutate({
      intervieweeEmail: data.intervieweeEmail,
      position: data.position,
      interviewerEmail: userEmail, // email of the form creator
    });
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-lg sm:text-lg font-bold">Dashboard</h1>

        <div className="flex items-center gap-x-3">
          <LogoutLink postLogoutRedirectURL="/">
            <Button size="sm">Logout</Button>
          </LogoutLink>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" size="sm">
                <Plus className="mr-2 h-4 w-4" /> New Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Interview</DialogTitle>
                <DialogDescription>
                  Use this form to invite interviewee to start the interview
                  session.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-y-2 py-2"
              >
                <div className="items-center space-y-2">
                  <Label htmlFor="interviewee-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="interviewee-email"
                    placeholder="interviewee@example.com"
                    className="col-span-3"
                    {...form.register("intervieweeEmail", { required: true })}
                  />
                </div>
                <div className="items-center space-y-2">
                  <Label htmlFor="position" className="text-right">
                    Role
                  </Label>
                  <Input
                    id="position"
                    placeholder="eg Software Developer"
                    {...form.register("position", { required: true })}
                    className="col-span-3"
                  />
                </div>
                <DialogFooter className="mt-2">
                  <Button type="submit">Send Invite</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-8" />

      <div className="overflow-x-auto flex-1 min-h-[230px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] sm:w-[200px]">
                Candidate
              </TableHead>
              <TableHead className="hidden sm:table-cell">Position</TableHead>
              <TableHead className="w-[120px] sm:w-[150px]">When</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "Exhausted" ? (
              <TableRow className="flex justify-center w-full items-center">
                <TableCell className="font-medium w-full">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              results.map((interview) => (
                <TableRow key={interview._id}>
                  <TableCell className="font-medium">
                    {interview.interviewee.first_name}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {interview.position}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(
                      parseISO(interview._creationTime.toString()),
                      {
                        addSuffix: true,
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={"default"}>{"interview.status"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon">
                      <Menu className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Button className="w-full" onClick={() => loadMore(5)}>
          Loadmore
        </Button>
      </div>
    </div>
  );
}

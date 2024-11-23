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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import {
  LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useConvex } from "convex/react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Menu, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Mock data for interviews
const interviews = [
  {
    id: 1,
    candidate: "John Doe",
    position: "Frontend Developer",
    datetime: "2023-06-15T10:00:00Z",
    status: "Scheduled",
  },
  {
    id: 2,
    candidate: "Jane Smith",
    position: "UX Designer",
    datetime: "2023-06-16T14:00:00Z",
    status: "Completed",
  },
  {
    id: 3,
    candidate: "Mike Johnson",
    position: "Backend Developer",
    datetime: "2023-06-17T11:30:00Z",
    status: "Cancelled",
  },
  {
    id: 4,
    candidate: "Emily Brown",
    position: "Product Manager",
    datetime: "2023-06-18T15:00:00Z",
    status: "Scheduled",
  },
  {
    id: 5,
    candidate: "Chris Wilson",
    position: "Data Scientist",
    datetime: "2023-06-19T13:00:00Z",
    status: "Scheduled",
  },
];

const FormSchema = z.object({
  position: z.string().min(1),
  intervieweeEmail: z.string().min(1),
});

export default function InterviewDashboard() {
  const [interviewerEmail, setInterviewerEmail] = useState<string | null>(null);
  const { getUser, isLoading, isAuthenticated } = useKindeBrowserClient();
  const convex = useConvex();

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
        setInterviewerEmail(user.email);
        console.log("user", user);
      }
    }
  }, [isLoading, isAuthenticated]);

  const { isPending, mutate } = useMutation({
    mutationKey: ["create_interview"],
    mutationFn: async (args: {
      interviewerEmail: string | null;
      intervieweeEmail: string;
      position: string;
    }) => {
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

      if (!interviewer || !interviewee) {
        return Promise.reject(new Error("Interviewee does not exist."));
      }

      const createRoomArgs: CreateReport = {
        position: args.position,
        roomId: generateId(7),
        participants: [
          {
            email: interviewer.email,
            first_name: interviewer.first_name,
            role: "interviewer",
          },
          {
            email: interviewee.email,
            first_name: interviewee.first_name,
            role: "interviewee",
          },
        ],
      };

      const req = await axios.post("/api", createRoomArgs);
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    mutate({
      intervieweeEmail: data.intervieweeEmail,
      position: data.position,
      interviewerEmail,
    });
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Interview Dashboard</h1>

        <LogoutLink postLogoutRedirectURL="/">
          <Button>Logout</Button>
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

      <div className="flex items-center space-x-2 mb-8" />

      <div className="overflow-x-auto">
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
            {interviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell className="font-medium">
                  {interview.candidate}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {interview.position}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(parseISO(interview.datetime), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={"default"}>{interview.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

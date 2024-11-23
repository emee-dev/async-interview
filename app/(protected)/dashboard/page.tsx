"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Menu } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

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

// type User = {
//   email: "emmanuelajike2000@gmail.com";
//   family_name: "Ajike";
//   given_name: "Emmanuel";
//   id: "kp_a4afe8716e454e5490295c765a3f06ea";
//   picture: "https://lh3.googleusercontent.com/a/ACg8ocIIjkK57Z-K7mswSGLU8wCOjGa4BjdtFR6UWmFhcxm2jhDWq9JC=s96-c";
// };
type User = {
  email: string | null;
  family_name: string | null;
  given_name: string | null;
  id: string;
  picture: string | null;
};

export default function InterviewDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [intervieweeEmail, setIntervieweeEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const { getUser, isLoading, isAuthenticated } = useKindeBrowserClient();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const user = getUser();

      if (user && user.email) {
        setUser(user);
        console.log("user", user);
      }
    }
  }, [isLoading, isAuthenticated]);

  const filteredInterviews = interviews.filter(
    (interview) =>
      interview.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { isPending, mutate } = useMutation({
    mutationKey: ["create_interview"],
    mutationFn: async () => {
      const req = await axios.post("/", {});
    },
  });

  const handleInvite = () => {
    // Here you would typically send the invite to the backend
    console.log("Sending invite to:", intervieweeEmail);
    setIntervieweeEmail("");
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Interview Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
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
            <div className="grid py-2">
              <div className="items-center space-y-2">
                <Label htmlFor="interviewee-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="interviewee-email"
                  placeholder="interviewee@example.com"
                  value={intervieweeEmail}
                  onChange={(e) => setIntervieweeEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="grid py-2">
              <div className=" items-center space-y-2">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input
                  id="role"
                  placeholder="eg Software Developer"
                  value={intervieweeEmail}
                  onChange={(e) => setIntervieweeEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleInvite} type="submit">
                Send Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 mb-8">
        {/* <Search className="h-5 w-5 text-gray-500" />
        <Input
          type="search"
          placeholder="Search interviews..."
          className="w-full sm:max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
      </div>

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
            {filteredInterviews.map((interview) => (
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

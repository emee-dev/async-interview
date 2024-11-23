"use client";

// Mock data for the interview results
// const interviewData = {
//   id: "1",
//   candidate: "John Doe",
//   position: "Frontend Developer",
//   date: "2023-06-15",
//   status: "Completed",
//   recordings: [
//     {
//       id: 1,
//       name: "Interview Recording",
//       duration: "45:30",
//       url: "/interview-recording.mp3",
//     },
//     {
//       id: 2,
//       name: "Coding Challenge",
//       duration: "30:15",
//       url: "/coding-challenge.mp3",
//     },
//   ],
//   transcript: `
// Interviewer: Hello John, thank you for joining us today. Can you tell us about your experience with React?

// John: I've been working with React for about 3 years now. I've built several large-scale applications using React, including a dashboard for a fintech company and an e-commerce platform.

// Interviewer: That's great. Can you describe a challenging problem you've solved using React?

// John: One challenging problem I faced was optimizing the performance of a complex dashboard with real-time data updates. I implemented...
// `,
//   summary: `
// # Final Interview Report\n\n## Summary of Interview\n### Key Highlights\n- The candidate, Nolan, demonstrated strong problem-solving skills and clear communication during a mock interview for a software engineering position at Jane Street.\n- Nolan has 6.5 years of experience as a software engineer at Jane Street.\n- He showed proficiency in Python and graph algorithms.\n\n---\n\n## Technical Skills Evaluation\n| Skill                | Proficiency Level (1-5) | Comments                                           |\n|----------------------|--------------------------|---------------------------------------------------|\n| Python               | 4                        | Demonstrated strong knowledge of Python syntax and data structures. |\n| Graph Algorithms     | 4                        | Implemented a BFS-based solution for unit conversion problem. |\n| Object-Oriented Programming | 4                 | Created appropriate classes for Node and Edge in the solution. |\n| Problem Solving      | 5                        | Quickly developed a graph-based approach to solve the unit conversion problem. |\n\n---\n\n## Strengths\n1. Excellent problem decomposition - broke down the unit conversion problem into manageable steps.\n2. Strong communication skills - clearly explained thought process and approach throughout.\n3. Proactive in identifying and addressing potential issues, such as bidirectional graph connections.\n4. Good code structure and readability, with clear variable names and comments.\n\n---\n\n## Areas for Improvement\n1. Initially missed implementing bidirectional connections in the graph, though quickly identified and corrected this.\n2. Could improve efficiency in certain areas, such as avoiding duplicate visited set additions.\n\n---\n\n## Behavioral Assessment\n- **Cultural Fit:** Excellent  \n  Demonstrated collaborative approach and openness to feedback.\n- **Communication Skills:** Excellent  \n  Clearly articulated thoughts and approach throughout the interview.\n- **Team Collaboration Potential:** Excellent  \n  Showed willingness to explain reasoning and accept suggestions.\n\n---\n\n## Overall Recommendation\n- **Recommendation:** Hire\n- **Rationale:** Nolan demonstrated strong technical skills, excellent problem-solving abilities, and clear communication. His approach to the problem and code quality align well with Jane Street's values.\n\n---\n\n## Interviewer Notes\n- Candidate showed familiarity with advanced concepts like Union-Find, indicating depth of knowledge.\n- Proactively identified and corrected potential issues in the solution.\n\n---\n\n## Next Steps (if any)\n- As this was a mock interview with an existing employee, no next steps are required. \n## Next Steps (if any)\n- As this was a mock interview with an existing employee, no next steps are required.
// `,
//   //   summary: `
//   // # Interview Summary

//   // ## Candidate: John Doe
//   // ## Position: Frontend Developer

//   // ### Technical Skills
//   // - Strong proficiency in React (3 years of experience)
//   // - Familiar with state management solutions (Redux, Context API)
//   // - Good understanding of performance optimization in React
//   // - Experience with modern JavaScript (ES6+)

//   // ### Projects Highlights
//   // 1. Fintech Dashboard
//   //    - Implemented real-time data updates
//   //    - Optimized performance for large datasets

//   // 2. E-commerce Platform
//   //    - Built responsive UI components
//   //    - Integrated with RESTful APIs

//   // ### Strengths
//   // - Problem-solving skills
//   // - Clear communication
//   // - Enthusiasm for learning new technologies

//   // ### Areas for Improvement
//   // - Could benefit from more experience with server-side rendering
//   // - Limited exposure to testing frameworks (Jest, React Testing Library)

//   // ### Recommendation
//   // Based on the interview, John demonstrates strong React skills and problem-solving abilities. He would be a valuable addition to our frontend team. Recommend proceeding to the next round.

//   // **Overall Rating: 8/10**
//   // `,
// };

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Pause, Play } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { MarkdownComponent } from "@/components/markdown";
import { api } from "@/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { NoData } from "@/components/no-data";
import { notFound } from "next/navigation";

type ComponentProps = {
  params: { id: string | null };
  searchParams: {};
};

export default function InterviewResults({ params }: ComponentProps) {
  const { data, isPending, error } = useQuery(
    convexQuery(
      api.interview.getPostInterviewData,
      params.id ? { roomId: params.id } : "skip"
    )
  );

  if (!params.id) {
    return notFound();
  }

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-4 h-screen px-4 sm:px-6 lg:px-6">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-muted-foreground">
          An error occurred while fetching the data. Please try again later.
        </p>
      </div>
    );
  }

  if (!data) {
    return <NoData />;
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-6 overflow-scroll">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-primary hover:underline inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-lg font-bold">{data.interviewee.first_name}</h1>
          <p className="text-muted-foreground">{data.position}</p>
        </div>
        <Badge variant="default">{/* data.status || */ "Completed"}</Badge>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <div className="overflow-scroll h-[500px] font-geistSans pb-4 no-scrollbar">
          <TabsContent value="recordings">
            <Card>
              <CardHeader>
                <CardTitle>Interview Recordings</CardTitle>
                <CardDescription>
                  Listen to the recorded interview sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.recording.length > 0 ? (
                  data.recording.map((recording) => (
                    <div
                      key={recording.uuid}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="font-medium">{recording.roomId}</p>
                        {/* <p className="text-sm text-muted-foreground">34</p> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(recording.url, "_blank")}
                        >
                          <Play className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No recordings available.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript">
            <Card>
              <CardHeader>
                <CardTitle>Interview Transcript</CardTitle>
                <CardDescription>
                  Full transcript of the interview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.analysis.transcripts.length > 0 ? (
                  data.analysis.transcripts.map((item, index) => (
                    <div
                      key={index}
                      className="whitespace-pre-wrap font-mono text-sm"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No transcript available.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="relative text-base">
            <Suspense fallback={<LoadingSpinner />}>
              {data.analysis.reportInMarkdown ? (
                <MarkdownComponent code={data.analysis.reportInMarkdown} />
              ) : (
                <p className="text-muted-foreground">No summary available.</p>
              )}
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";
// import { useSuperVizContext } from "@/context";
// import { generateId } from "@/lib/utils";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useConvex, useMutation, usePaginatedQuery } from "convex/react";
// import { Loader2 } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { api } from "../convex/_generated/api";
// import { Doc, DataModel } from "@/convex/_generated/dataModel";

// export default function LandingPage() {
//   const router = useRouter();
//   const context = useSuperVizContext();
//   const convex = useConvex();

//   const {
//     results: escrows,
//     isLoading: isLoadingEscrows,
//     loadMore: loadMoreEscrows,
//     status: statusEscrows,
//   } = usePaginatedQuery(
//     api.escrow.listEscrowRooms,
//     context.visitorId
//       ? {
//           visitorId: context.visitorId,
//         }
//       : "skip",
//     { initialNumItems: 5 }
//   );

//   const {
//     results: disputes,
//     isLoading: isLoadingDisputes,
//     loadMore: loadMoreDisputes,
//     status: statusDisputes,
//   } = usePaginatedQuery(
//     api.dispute.listDisputeRooms,
//     context.visitorId
//       ? {
//           visitorId: context.visitorId,
//         }
//       : "skip",
//     { initialNumItems: 5 }
//   );

//   useEffect(() => {
//     console.log("disputes", disputes);
//   }, [disputes]);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <header className="border-b">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center h-16">
//             <h1 className="text-xl font-semibold">Escrow System</h1>
//             <CreateRoomDialog />
//           </div>
//         </div>
//       </header>
//       <main className="flex-grow container mx-auto mt-9 px-4 py-8">
//         <Tabs defaultValue="escrows" className="w-full max-w-4xl mx-auto">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="escrows">Escrows</TabsTrigger>
//             <TabsTrigger value="disputes">Disputes</TabsTrigger>
//           </TabsList>
//           <TabsContent value="escrows">
//             <EscrowsTable
//               escrows={escrows}
//               isLoading={isLoadingEscrows}
//               status={statusEscrows}
//               loadMore={loadMoreEscrows}
//             />
//           </TabsContent>
//           <TabsContent value="disputes">
//             <DisputesTable
//               router={router}
//               convex={convex}
//               context={context}
//               disputes={disputes}
//               status={statusDisputes}
//               isLoading={isLoadingDisputes}
//               loadMore={loadMoreDisputes}
//             />
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// }

// function EscrowsTable({
//   escrows,
//   isLoading,
//   status,
//   loadMore,
// }: {
//   escrows: Doc<"escrowRooms">[];
//   isLoading: boolean;
//   status: any;
//   loadMore: (v: number) => void;
// }) {
//   if (isLoading) {
//     return <LoadingState />;
//   }

//   if (status === "Exhausted" && escrows.length === 0) {
//     return <EmptyState message="No escrows found." />;
//   }

//   return (
//     <>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Title</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {escrows.map((escrow) => (
//             <TableRow key={escrow._id}>
//               <TableCell>{escrow._id}</TableCell>
//               <TableCell>
//                 $ {escrow.amount} - {escrow.asset}
//               </TableCell>
//               <TableCell>{escrow.payment_status}</TableCell>
//               <TableCell>
//                 <Link
//                   href={`/room?roomId=${escrow.roomId}&groupId=${escrow.groupId}`}
//                 >
//                   <Button variant="outline" size="sm">
//                     Goto Room
//                   </Button>
//                 </Link>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       {status === "CanLoadMore" && (
//         <div className="mt-4 text-center">
//           <Button onClick={() => loadMore(5)} variant="outline">
//             Load More
//           </Button>
//         </div>
//       )}
//     </>
//   );
// }

// function DisputesTable({
//   disputes,
//   isLoading,
//   status,
//   loadMore,
//   convex,
//   context,
//   router,
// }: {
//   disputes: Doc<"disputeRooms">[];
//   isLoading: boolean;
//   status: any;
//   loadMore: (v: number) => void;
//   convex: any;
//   context: any;
//   router: any;
// }) {
//   if (isLoading) {
//     return <LoadingState />;
//   }

//   if (status === "Exhausted" && disputes.length === 0) {
//     return <EmptyState message="No disputes found." />;
//   }

//   return (
//     <>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Escrow Id</TableHead>
//             <TableHead>Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {disputes.map((dispute) => (
//             <TableRow key={dispute._id}>
//               <TableCell>{dispute._id}</TableCell>
//               <TableCell>{dispute.disputeStatus}</TableCell>
//               <TableCell>{dispute.escrowRoomId}</TableCell>
//               <TableCell>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={async () => {
//                     const details = await convex.query(api.escrow.getRoomById, {
//                       escrowRoomId: dispute.escrowRoomId,
//                     });

//                     if (!details.data) {
//                       console.log("Unable to redirect to dispute chat.");
//                       return;
//                     }

//                     const userType =
//                       details.data.creator.visitorId === context.visitorId
//                         ? "creator"
//                         : "reciever";

//                     router.push(
//                       `/dispute?userType=${userType}&roomId=${details.data.roomId}&groupId=${details.data.groupId}`
//                     );
//                   }}
//                 >
//                   Goto Chat
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       {status === "CanLoadMore" && (
//         <div className="mt-4 text-center">
//           <Button onClick={() => loadMore(5)} variant="outline">
//             Load More
//           </Button>
//         </div>
//       )}
//     </>
//   );
// }

// function LoadingState() {
//   return (
//     <div className="flex justify-center items-center h-64">
//       <Loader2 className="h-8 w-8 animate-spin text-primary" />
//     </div>
//   );
// }

// function EmptyState({ message }: { message: string }) {
//   return (
//     <div className="text-center py-10">
//       <p className="text-muted-foreground">{message}</p>
//     </div>
//   );
// }

// const createRoomSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
//   amount_to_recieve: z.string(),
//   asset_to_recieve: z.string(),
//   terms: z.string(),
// });

// function CreateRoomDialog() {
//   const router = useRouter();
//   const context = useSuperVizContext();
//   const createEscrow = useMutation(api.escrow.createEscrowRoom);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<z.infer<typeof createRoomSchema>>({
//     resolver: zodResolver(createRoomSchema),
//     defaultValues: {
//       username: "",
//       amount_to_recieve: "10",
//       asset_to_recieve: "USDT",
//       terms: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof createRoomSchema>) {
//     setIsSubmitting(true);
//     try {
//       if (!context.visitorId) {
//         console.log("Could not find visitorId");
//         return;
//       }

//       const roomId = generateId();
//       const group = {
//         id: `group-${roomId}`,
//         name: `group-${roomId}`,
//       };

//       const participant = {
//         id: `participant-${context.visitorId}`,
//         name: `participant-${values.username}`,
//       };

//       context.setGroup(group);
//       context.setRoomId(roomId);
//       context.setParticipant(participant);

//       await createEscrow({
//         roomId: roomId,
//         groupId: group.id,
//         payment_status: "default",
//         terms: values.terms,
//         creator: {
//           username: values.username,
//           visitorId: context.visitorId,
//         },
//         amount: values.amount_to_recieve,
//         asset: values.asset_to_recieve,
//       });

//       router.push(`/room?roomId=${roomId}&groupId=${group.id}`);
//     } catch (error: any) {
//       console.error("Failed to create room: ", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="default">Create Escrow</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create New Escrow</DialogTitle>
//           <DialogDescription>
//             Set up an escrow to securely transfer funds or assets.
//           </DialogDescription>
//         </DialogHeader>
//         <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="user_name">Username</Label>
//               <Input
//                 id="user_name"
//                 type="text"
//                 placeholder="Your username"
//                 {...form.register("username")}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="amount">Amount to receive</Label>
//               <Input
//                 id="amount"
//                 type="number"
//                 placeholder="0.00"
//                 {...form.register("amount_to_recieve")}
//               />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="token-types">Asset to receive</Label>
//             <Input
//               id="asset"
//               type="text"
//               value="USDT"
//               placeholder="Tether (USDT)"
//               {...form.register("asset_to_recieve")}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="terms">Additional Terms</Label>
//             <Textarea
//               id="terms"
//               rows={2}
//               {...form.register("terms")}
//               placeholder="Enter any additional terms or conditions..."
//             />
//           </div>
//           <Button type="submit" className="ml-auto" disabled={isSubmitting}>
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               "Create Escrow"
//             )}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

import {
  RegisterLink,
  LoginLink,
  LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col overflow-scroll h-full px-5">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 mt-2 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="#">
          <Zap className="h-6 w-6 text-primary" />
          <span className="ml-2 text-base font-geistSans font-bold">
            Async Interview
          </span>
        </Link>
        <nav className="flex gap-4 sm:gap-6 font-geistSans">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full mt-5 py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-geistSans font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Meet Your Perfect Hackathon Team
            </h1>
            <p className="mx-auto tracking-tight max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              HackMatch connects you with like-minded developers, designers, and
              innovators for your next hackathon adventure.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <LoginLink postLoginRedirectURL="/dashboard" className="w-full ">
                <Button type="submit" className="w-full">
                  Get Started
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </LoginLink>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Start building your dream team today. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full font-mono py-12 bg-gray-100 dark:bg-gray-800">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-6">
          <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            <Users className="size-9 mb-4 text-primary" />
            <h2 className="text-xl font-bold">Smart Matching</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Our AI-powered algorithm finds the perfect teammates based on
              skills, interests, and goals.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            <Code className="size-9 mb-4 text-primary" />
            <h2 className="text-xl font-bold">Skill Showcase</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Highlight your coding prowess and past projects to attract the
              right collaborators.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            <Zap className="size-9 mb-4 text-primary" />
            <h2 className="text-xl font-bold">Instant Connections</h2>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Chat, video call, and collaborate with potential teammates in
              real-time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Hack?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg tracking-tight dark:text-gray-400">
              Join HackMatch today and start building your dream team for the
              next big hackathon.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <RegisterLink
                postLoginRedirectURL="/dashboard"
                className="w-full"
              >
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </RegisterLink>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center justify-between px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 HackMatch. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </main>
  );
}

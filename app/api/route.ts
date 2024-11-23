import { inngest } from "@/inngest/client";
import axios from "axios";

export const dynamic = "force-dynamic";

type Recording = {
  uuid: string;
  url: string;
  status: "available" | "processing";
  meetingId: string;
  roomId: string;
  createdAt: string;
};

type RecordResponse = {
  data: Recording[];
  pagination: {
    page: 1;
    totalPages: 1;
    limit: 10;
    total: 2;
  };
};

export type Pariticipants = {
  email: string;
  given_name: string;
  role: "interviewer" | "interviewee";
};

// let recordings = [
//   {
//     uuid: "5323c958-ecbd-4358-b85d-0bf5b82d7f27",
//     url: "https://sdk-meeting-recording-mediapipelineconcatbucketeb1-riktmr42rnzq.s3.amazonaws.com/ff72aac6-ca39-42a4-a064-5caabc693811/composited-video/687b94f9-baa9-4466-80a6-c3974bd2e22e.mp4?AWSAccessKeyId=AKIA2JLS52PWOTGGQHFD&Expires=1732103867&Signature=bDU1d7fthmzAFy8YR0dPmEKxEgc%3D",
//     status: "processing",
//     meetingId: "cfcccfb3-8b43-4070-a43b-15f77a7d2713",
//     roomId: "DEMO_ROOM",
//     createdAt: "2024-11-19T12:29:01.814Z",
//   },
//   {
//     uuid: "32fe732d-1fb9-43ee-bb05-8558f3fe647d",
//     url: "https://sdk-meeting-recording-mediapipelineconcatbucketeb1-riktmr42rnzq.s3.amazonaws.com/1f9aeaaa-8feb-47f0-922a-ddaad773ebb7/composited-video/d4b0251c-5bae-4fc9-83db-2726e63d90cf.mp4?AWSAccessKeyId=AKIA2JLS52PWOTGGQHFD&Expires=1732103867&Signature=wstlgMd5Y0KvVh8HzqYd05MCpFY%3D",
//     status: "processing",
//     meetingId: "70b148ea-c986-439e-a1b3-c9ab2aa42713",
//     roomId: "DEMO_ROOM",
//     createdAt: "2024-11-19T12:22:37.858Z",
//   },
// ];

// let lastUpdateTime = Date.now(); // Track when statuses were last updated

// export const POST = async (req: Request) => {
//   const { roomId } = (await req.json()) as { roomId: string };

//   if (!roomId) {
//     return Response.json({ error: "roomId is required", data: recordings });
//   }

//   // Simulate processing to available status after some time
//   const elapsedTime = Date.now() - lastUpdateTime;
//   if (elapsedTime > 5000) {
//     // 5 seconds threshold
//     recordings = recordings.map((recording) =>
//       recording.status === "processing"
//         ? { ...recording, status: "available" }
//         : recording
//     );
//     lastUpdateTime = Date.now();
//   }

//   // Filter recordings by roomId
//   const roomRecordings = recordings.filter(
//     (recording) => recording.roomId === roomId
//   );

//   return Response.json({ data: roomRecordings });
// };

export type CreateReport = {
  roomId: string;
  position: string; // eg Software developer
  participants: Pariticipants[];
};

export const POST = async (req: Request) => {
  try {
    const params = (await req.json()) as CreateReport;

    await inngest.send({
      name: "interview/room.create",
      data: {
        roomId: params.roomId,
        position: params.position,
        participants: params.participants,
      } as CreateReport,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error.", data: null });
  }
};

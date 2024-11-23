import { inngest } from "@/inngest/client";

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
  first_name: string;
  role: "interviewer" | "interviewee";
};

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

    return Response.json({
      message: "Creating room please, check your email.",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error.", data: null });
  }
};

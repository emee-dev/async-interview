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
};

export type CreateReport = {
  roomId: string;
  roomStatus: "pending" | "in-progress" | "concluded";
  position: string; // eg Software developer
  interviewer: Pariticipants;
  interviewee: Pariticipants;
};

export const POST = async (req: Request) => {
  try {
    const params = (await req.json()) as CreateReport;

    await inngest.send({
      name: "interview/room.create",
      data: {
        roomId: params.roomId,
        position: params.position,
        roomStatus: params.roomStatus,
        interviewer: params.interviewer,
        interviewee: params.interviewee,
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

export type GenerateReport = Pick<CreateReport, "roomId">;

export const PUT = async (req: Request) => {
  try {
    const params = (await req.json()) as GenerateReport;

    await inngest.send({
      name: "interview/interview.report",
      data: {
        roomId: params.roomId,
      } as GenerateReport,
    });

    return Response.json({
      message: "Generating reports, check your email.",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error.", data: null });
  }
};

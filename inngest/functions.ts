import { api } from "@/convex/_generated/api";
import { AssemblyAI } from "assemblyai";
import axios from "axios";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { Context, Inngest, NonRetriableError } from "inngest";
import { inngest } from "./client";
import { Resend } from "resend";
import { render } from "@react-email/render";
import InterviewCreated from "@/emails/InterviewCreated";
import InterviewReport from "@/emails/InterviewReport";
import { env } from "@/lib/env";
import { CreateReport, GenerateReport } from "@/app/api/route";
import { User } from "@/app/api/webhook/route";
import { SNIPPETS } from "@/consts";

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

const SUPERVIZ_CLIENT_ID = env.SUPERVIZ_CLIENT_ID;
const SUPERVIZ_SECRET_KEY = env.SUPERVIZ_SECRET_KEY;
const APP_BASE_URL = env.APP_BASE_URL;

const client = new AssemblyAI({
  apiKey: env.ASSEMBLYAI_API_KEY,
});

const resend = new Resend(env.RESEND_API_KEY);

// Mock interview: https://youtu.be/V8DGdPkBBxg?si=0wnL5CIOK8k_g6B5

type RecordErrorName = "NO_RECORDING_FOUND" | "PROCESSING_RECORD";
type AppErrorNames = "UNABLE_TO_CREATE_RECORD" | "RECORD_NOT_FOUND";

class RecordError extends Error {
  public name: RecordErrorName;
  constructor(message: string, name: RecordErrorName) {
    super(message);
    this.name = name;
  }
}

class AppError extends Error {
  public name: AppErrorNames;
  constructor(message: string, name: AppErrorNames) {
    super(message);
    this.name = name;
  }
}

// Prompt template for transcript LLM interaction
const createPrompt = (objective: string, additionalInstructions?: string) => {
  return `
    Objective: ${objective}
    ${additionalInstructions ? `Additional Instructions: ${additionalInstructions}` : ""}

    Structure your response in the following markdown format:
    It is best to do nothing if you do not understand.

    # Final Interview Report

    ## Summary of Interview
    ### Key Highlights
    - Provide a brief summary of the candidate's background, experience, and overall impression.

    ---

    ## Technical Skills Evaluation
    | Skill                | Proficiency Level (1-5) | Comments                                           |
    |----------------------|--------------------------|---------------------------------------------------|
    | Example: JavaScript  | 4                        | Strong understanding of frameworks like React.    |
    | [Skill Name]         | [Rating]                | [Comments about how the skill was demonstrated.] |
    | [Skill Name]         | [Rating]                | [Comments about how the skill was demonstrated.] |

    ---

    ## Strengths
    1. Highlight specific strengths observed during the interview.
    2. Example: "Strong problem-solving skills demonstrated in coding exercise."
    3. Example: "Excellent knowledge of cloud infrastructure tools like AWS."

    ---

    ## Areas for Improvement
    1. Mention any areas where the candidate can improve.
    2. Example: "Limited experience with DevOps tools."
    3. Example: "Could improve clarity in explaining complex topics."

    ---

    ## Behavioral Assessment
    - **Cultural Fit:** Provide a rating (e.g., Excellent/Good/Average/Poor).  
      Add comments on how the candidate aligns with the company's culture.
    - **Communication Skills:** Provide a rating and comments on clarity and confidence.
    - **Team Collaboration Potential:** Provide a rating and comments on teamwork skills.

    ---

    ## Overall Recommendation
    - **Recommendation:** State whether to Hire, Move to Next Round, or Reject.
    - **Rationale:** Provide a concise explanation supporting the decision.

    ---

    ## Interviewer Notes
    - Include any additional observations or notes.
    - Example: "Candidate expressed enthusiasm for learning company-specific tools."

    ---

    ## Next Steps (if any)
    - Specify the next steps for the candidate. Example: "Schedule a second-round interview" or "Send feedback email."
  `.trim();
};

async function recordings() {
  const URL = "https://api.superviz.com/recording";

  const reqdata = await axios.get(URL, {
    headers: {
      "Content-Type": "application/json",
      client_id: SUPERVIZ_CLIENT_ID,
      secret: SUPERVIZ_SECRET_KEY,
    },
  });

  return reqdata.data as RecordResponse;
}

export const createRoom = inngest.createFunction(
  { id: "before-interview" },
  { event: "interview/room.create" },
  async ({ event, step }: Context<Inngest<{ id: string }>>) => {
    const payload = event.data as CreateReport;

    const createRoom = await step.run("create_room", async () => {
      const res = await fetchMutation(
        api.interview.createRoom,
        {
          roomId: payload.roomId,
          status: payload.roomStatus,
          position: payload.position,
          interviewer: payload.interviewer,
          interviewee: payload.interviewee,
        },
        { url: env.NEXT_PUBLIC_CONVEX_URL }
      );

      if (!res) {
        throw new AppError(
          `Error creating room. Id: ${payload.roomId}`,
          "UNABLE_TO_CREATE_RECORD"
        );
      }

      return res;
    });

    await step.run("create_editor_state", async () => {
      const language = "javascript";

      const res = await fetchMutation(
        api.code_editor.createEditorState,
        {
          language,
          stdOut: "",
          stdErr: "",
          activeTab: "stdout",
          code: SNIPPETS[language],
          roomId: createRoom.roomId,
        },
        { url: env.NEXT_PUBLIC_CONVEX_URL }
      );

      if (!res) {
        throw new AppError(
          `Error creating editor state. RoomId: ${payload.roomId}`,
          "UNABLE_TO_CREATE_RECORD"
        );
      }

      return res;
    });

    const notifyRoomCreated = await step.run("email_room_created", async () => {
      const interviewer = createRoom.interviewer;
      const interviewee = createRoom.interviewee;

      if (!interviewer || !interviewee) {
        throw new Error("Was unable to find the room participants.");
      }

      const { error, data } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [interviewer.email, interviewee.email],
        subject: "Interview scheduled.",
        html: await render(
          InterviewCreated({
            interviewerName: interviewer.first_name,
            intervieweeName: interviewee.first_name,
            interviewRoomLink: `${APP_BASE_URL}/room/${payload.roomId}`,
          })
        ),
      });

      if (error) {
        // TODO improve
        throw error;
      }

      return data;
    });

    return notifyRoomCreated;
  }
);

export const generateReport = inngest.createFunction(
  { id: "after-interview" },
  { event: "interview/interview.report" },
  async ({ event, step }: Context<Inngest<{ id: string }>>) => {
    const payload = event.data as GenerateReport;

    const getRoom = await step.run("get_room", async () => {
      const res = await fetchQuery(
        api.interview.getRoomById,
        {
          roomId: payload.roomId,
        },
        { url: env.NEXT_PUBLIC_CONVEX_URL }
      );

      if (!res) {
        throw new AppError(
          `Error creating editor state. RoomId: ${payload.roomId}`,
          "UNABLE_TO_CREATE_RECORD"
        );
      }

      return res;
    });

    const getRecordings = await step
      .run("get_recordings", async () => {
        const records = await recordings();

        const findRecords = records.data.filter(
          (item) => item.roomId === payload.roomId
        );

        if (!findRecords || findRecords.length === 0) {
          throw new RecordError(
            "Could not find recording.",
            "NO_RECORDING_FOUND"
          );
        }

        // Make sure all the records has been processed and is available.
        const isProcessing = findRecords.find(
          (item) => item.status === "processing"
        );

        if (isProcessing) {
          throw new RecordError(
            "Superviz still processing recordings, retrying.",
            "PROCESSING_RECORD"
          );
        }

        return findRecords;
      })
      .catch((err: RecordError) => {
        if (err.name === "NO_RECORDING_FOUND") {
          throw new NonRetriableError(err.message);
        }

        throw err;
      });

    // Generate transcripts
    const transcripts = await step.run("generate_transcripts", async () => {
      const recordings = getRecordings.map((item) => item.url);

      const transcripts = await Promise.all(
        recordings.map((url) =>
          client.transcripts.transcribe({
            audio_url: url,
          })
        )
      );

      const isErrorPresent = transcripts.find((item) => item.error);

      // Find any occurance of an error, then retry.
      if (isErrorPresent) {
        throw new Error(isErrorPresent.error);
      }

      return transcripts;
    });

    // LLM extract insights or report summary
    const extractInsights = await step.run("extract_insights", async () => {
      const objective =
        "Summarize the candidate's key strengths and weaknesses as discussed in the transcript.";
      const additionalInstructions =
        "Focus on technical skills mentioned and provide concrete examples. Exclude generic or unrelated information.";

      const prompt = createPrompt(objective, additionalInstructions);

      const { response } = await client.lemur.task({
        transcript_ids: transcripts.map((item) => item.id),
        prompt,
        temperature: 0.4,
        max_output_size: 4000, // probably max
        final_model: "anthropic/claude-3-5-sonnet",
      });

      return {
        reportInMarkdown: response,
        transcripts: transcripts
          .map((item) => item.text)
          .filter(Boolean) as string[],
      };
    });

    const saveFinalReport = await step.run("store_final_report", async () => {
      const data = await fetchMutation(
        api.interview.storePostInterviewData,
        {
          roomId: payload.roomId,
          recording: getRecordings,
          analysis: extractInsights,
        },
        { url: env.NEXT_PUBLIC_CONVEX_URL }
      );

      if (!data) {
        throw new AppError(
          `Unable to create post interview data.`,
          "UNABLE_TO_CREATE_RECORD"
        );
      }

      return data;
    });

    const emailReports = await step.run("email_reports", async () => {
      const interviewer = getRoom.interviewer;
      const interviewee = getRoom.interviewee;

      if (!interviewer || !interviewee) {
        throw new Error("Was unable to find the room participants.");
      }

      const { error, data } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [interviewer.email, interviewee.email],
        subject: "Interview report generated.",
        html: await render(
          InterviewReport({
            interviewerName: interviewer.first_name,
            intervieweeName: interviewee.first_name,
            reportLink: `${APP_BASE_URL}/interview/${saveFinalReport._id}`,
          })
        ),
      });

      if (error) {
        // TODO improve
        throw error;
      }

      return data;
    });

    return saveFinalReport;
  }
);

export const handleUserCreateEvent = inngest.createFunction(
  { id: "kinde-webhook" },
  { event: "webhook/user.create" },
  async ({ event, step }: Context<Inngest<{ id: string }>>) => {
    const payload = event.data as User;

    return await step.run("kinde_create_user", async () => {
      const record = await fetchMutation(
        api.interview.upsertUserRecord,
        {
          email: payload.email,
          first_name: payload.first_name,
          last_name: payload.last_name,
          kindeId: payload.kindeId,
        },
        { url: env.NEXT_PUBLIC_CONVEX_URL }
      );

      if (!record) {
        throw new AppError(
          "Unable to insert record, retrying.",
          "UNABLE_TO_CREATE_RECORD"
        );
      }

      return record;
    });
  }
);

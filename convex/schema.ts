import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      email: v.string(),
      first_name: v.string(),
      last_name: v.string(),
      kindeId: v.string(),
    }),

    interview_rooms: defineTable({
      roomId: v.string(),
      position: v.string(),
      interviewer: v.object({
        email: v.string(),
        first_name: v.string(),
      }),
      interviewee: v.object({
        email: v.string(),
        first_name: v.string(),
      }),
    }),

    final_data: defineTable({
      roomId: v.string(),
      recording: v.array(
        v.object({
          uuid: v.string(),
          url: v.string(),
          status: v.string(),
          meetingId: v.string(),
          roomId: v.string(),
          createdAt: v.string(),
        })
      ),
      analysis: v.object({
        transcripts: v.array(v.string()),
        reportInMarkdown: v.string(),
      }),
    }),

    editor_states: defineTable({
      roomId: v.string(),
      language: v.string(),
      code: v.string(),
      stdOut: v.string(),
      stdErr: v.string(),
      activeTab: v.union(v.literal("stdout"), v.literal("stderr")),
    }),
  },
  { schemaValidation: true }
);

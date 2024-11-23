import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    interview_rooms: defineTable({
      roomId: v.string(),
      position: v.string(),
      participants: v.array(
        v.object({
          email: v.string(),
          given_name: v.string(),
          role: v.union(v.literal("interviewer"), v.literal("interviewee")),
        })
      ),
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
  },
  { schemaValidation: true }
);

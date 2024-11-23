import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// const BACKEND_AI_WEBHOOK = process.env.BACKEND_AI_WEBHOOK;

/**
 * Creates room with initial pariticipant
 */
export const createRoom = mutation({
  args: {
    roomId: v.string(),
    position: v.string(),
    participants: v.array(
      v.object({
        email: v.string(),
        first_name: v.string(),
        role: v.union(v.literal("interviewer"), v.literal("interviewee")),
      })
    ),
  },
  handler: async (ctx, { roomId, participants, position }) => {
    const room = await ctx.db
      .query("interview_rooms")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    if (!room) {
      console.warn(`Error finding room with id: ${roomId}`);
      return null;
    }

    const createRecord = await ctx.db.insert("interview_rooms", {
      roomId,
      position,
      participants,
    });

    const getRecord = await ctx.db.get(createRecord);

    return getRecord;
  },
});

export const getRoomById = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, { roomId }) => {
    const room = await ctx.db
      .query("interview_rooms")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    if (!room) {
      console.log(`Unable to get room by id: ${roomId}`);
      return null;
    }

    return room;
  },
});

export const storePostInterviewData = mutation({
  args: {
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
  },
  handler: async (ctx, { roomId, analysis, recording }) => {
    const room = await ctx.db
      .query("interview_rooms")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    if (!room) {
      console.warn(`Error finding room with id: ${roomId}`);
      return null;
    }

    const record = await ctx.db.insert("final_data", {
      roomId,
      analysis,
      recording,
    });

    console.log("Post interview data was inserted.");

    return await ctx.db.get(record);
  },
});

export const getPostInterviewData = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, { roomId }) => {
    const final_data = await ctx.db
      .query("final_data")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    console.log(
      `Post interview data roomId: ${roomId} and record: ${final_data?._id}`
    );

    return final_data;
  },
});

export const upsertUserRecord = mutation({
  args: {
    email: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    kindeId: v.string(),
  },
  handler: async (ctx, { email, first_name, kindeId, last_name }) => {
    const userRecord = await ctx.db
      .query("users")
      .filter((q) =>
        q.add(q.eq(q.field("email"), email), q.eq(q.field("kindeId"), kindeId))
      )
      .first();

    if (!userRecord) {
      const createRecord = await ctx.db.insert("users", {
        email,
        kindeId,
        first_name,
        last_name,
      });

      return await ctx.db.get(createRecord);
    }

    return userRecord;
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

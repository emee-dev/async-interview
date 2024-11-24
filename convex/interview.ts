import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const createRoom = mutation({
  args: {
    roomId: v.string(),
    position: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("in-progress"),
      v.literal("concluded")
    ),
    interviewer: v.object({
      email: v.string(),
      first_name: v.string(),
    }),
    interviewee: v.object({
      email: v.string(),
      first_name: v.string(),
    }),
  },
  handler: async (
    ctx,
    { roomId, interviewee, status, interviewer, position }
  ) => {
    const room = await ctx.db
      .query("interview_rooms")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    if (!room) {
      console.warn(`Creating room with roomId: ${roomId}`);
      const createRecord = await ctx.db.insert("interview_rooms", {
        roomId,
        status,
        position,
        interviewer,
        interviewee,
      });

      const getRecord = await ctx.db.get(createRecord);

      return getRecord;
    }

    console.warn(`Room already exists: ${roomId}`);
    return room;
  },
});

export const updateRoomState = mutation({
  args: {
    roomId: v.string(),
    status: v.union(v.literal("in-progress"), v.literal("concluded")),
  },
  handler: async (ctx, { roomId, status }) => {
    const room = await ctx.db
      .query("interview_rooms")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    if (!room) {
      console.warn(`Could not find room with roomId: ${roomId}`);
      return null;
    }

    await ctx.db.patch(room._id, { status });
    return room;
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

export const getRoomsByEmail = query({
  args: {
    email: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { email, paginationOpts }) => {
    const records = await ctx.db
      .query("interview_rooms")
      .filter((q) =>
        q.or(
          q.eq(q.field("interviewer.email"), email),
          q.eq(q.field("interviewee.email"), email)
        )
      )
      .order("desc")
      .paginate(paginationOpts);
    return records;
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
    const roomRecord = await ctx.db
      .query("interview_rooms")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    if (!roomRecord) {
      return null;
    }

    const final_data = await ctx.db
      .query("final_data")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    console.log(
      `Post interview data roomId: ${roomId} and record: ${final_data?._id}`
    );

    if (!final_data) {
      return null;
    }

    return { ...roomRecord, ...final_data };
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

// For code editors edits

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createEditorState = mutation({
  args: {
    roomId: v.string(),
    language: v.string(),
    code: v.string(),
    stdOut: v.string(),
    stdErr: v.string(),
    activeTab: v.union(v.literal("stdout"), v.literal("stderr")),
  },
  handler: async (ctx, args) => {
    const editorState = await ctx.db
      .query("editor_states")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (!editorState) {
      console.warn(`Creating editor state for roomId: ${args.roomId}`);

      const record = await ctx.db.insert("editor_states", args);

      return await ctx.db.get(record);
    }

    return editorState;
  },
});

export const mutateCodeEditor = mutation({
  args: {
    roomId: v.string(),
    language: v.string(),
    code: v.string(),
    stdOut: v.string(),
    stdErr: v.string(),
    activeTab: v.union(v.literal("stdout"), v.literal("stderr")),
  },
  handler: async (ctx, args) => {
    const editorState = await ctx.db
      .query("editor_states")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (!editorState) {
      console.warn(`Creating editor state for roomId: ${args.roomId}`);

      const record = await ctx.db.insert("editor_states", args);

      return await ctx.db.get(record);
    }

    // If editorState exists already, then we would just update it.

    await ctx.db.patch(editorState._id, args);
  },
});

export const queryCodeEditor = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, { roomId }) => {
    const editorState = await ctx.db
      .query("editor_states")
      .filter((q) => q.eq(q.field("roomId"), roomId))
      .first();

    if (!editorState) {
      console.log(`Unable to editorState by roomId: ${roomId}`);
      return null;
    }

    return editorState;
  },
});

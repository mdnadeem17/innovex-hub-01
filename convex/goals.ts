import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const goals = await ctx.db.query("goals").order("desc").collect();
        return await Promise.all(goals.map(async (goal) => {
            let imageUrl = goal.image_url;
            if (imageUrl && !imageUrl.startsWith("http")) {
                try {
                    const url = await ctx.storage.getUrl(imageUrl);
                    imageUrl = url || "";
                } catch (e) {
                    imageUrl = "";
                }
            }
            return { ...goal, image_url: imageUrl };
        }));
    },
});

export const create = mutation({
    args: {
        text: v.string(),
        image_url: v.string(),
        created_at: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("goals", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("goals"),
        text: v.optional(v.string()),
        image_url: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const deleteGoal = mutation({
    args: { id: v.id("goals") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

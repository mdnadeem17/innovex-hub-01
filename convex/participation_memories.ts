import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { participation_id: v.id("participations") },
    handler: async (ctx, args) => {
        const memories = await ctx.db.query("participation_memories")
            .withIndex("by_participation_id", (q) => q.eq("participation_id", args.participation_id))
            .collect();

        return await Promise.all(memories.map(async (m) => {
            let imageUrl = m.image_url;
            if (imageUrl && !imageUrl.startsWith("http")) {
                try {
                    imageUrl = (await ctx.storage.getUrl(imageUrl)) || imageUrl;
                } catch (e) { }
            }
            return { ...m, image_url: imageUrl };
        }));
    },
});

export const create = mutation({
    args: {
        participation_id: v.id("participations"),
        title: v.string(),
        description: v.string(),
        image_url: v.string(),
        category: v.string(),
        date: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("participation_memories", args);
    },
});

export const deleteMemory = mutation({
    args: { id: v.id("participation_memories") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

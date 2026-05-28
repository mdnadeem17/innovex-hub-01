import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { achievement_id: v.id("achievements") },
    handler: async (ctx, args) => {
        const memories = await ctx.db.query("achievement_memories")
            .withIndex("by_achievement_id", (q) => q.eq("achievement_id", args.achievement_id))
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
        achievement_id: v.id("achievements"),
        title: v.string(),
        description: v.string(),
        image_url: v.string(),
        category: v.string(),
        date: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("achievement_memories", args);
    },
});

export const deleteMemory = mutation({
    args: { id: v.id("achievement_memories") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

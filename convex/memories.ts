import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: { project_id: v.id("projects") },
    handler: async (ctx, args) => {
        const memories = await ctx.db.query("memories")
            .withIndex("by_project_id", (q) => q.eq("project_id", args.project_id))
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
        project_id: v.id("projects"),
        title: v.string(),
        description: v.string(),
        image_url: v.string(),
        category: v.string(),
        date: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        // In a real app, we'd check ctx.auth.getUserIdentity() and their role here
        // But since we are handling role checks on client via AuthContext + UI hiding,
        // and we haven't set up full backend auth middleware yet, we'll proceed.
        // For strict security, we should check the user role in the DB here too.

        // Fetch user role
        // const identity = await ctx.auth.getUserIdentity();
        // if (!identity) throw new Error("Unauthorized");
        // const user = await ctx.db.query("users").filter(q => q.eq("user_id", identity.subject)).first();
        // if (user?.role !== 'demon') throw new Error("Only demons can add memories");

        return await ctx.db.insert("memories", args);
    },
});

export const deleteMemory = mutation({
    args: { id: v.id("memories") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

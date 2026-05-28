import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const checkCredentials = query({
    args: { userId: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
            .filter((q) => q.eq(q.field("password"), args.password))
            .first();

        return user;
    },
});


export const hasUsers = query({
    args: {},
    handler: async (ctx) => {
        const user = await ctx.db.query("users").first();
        return !!user;
    },
});

export const create = mutation({
    args: {
        user_id: v.string(),
        password: v.string(),
        name: v.string(),
        college: v.optional(v.string()),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if user already exists
        const existing = await ctx.db
            .query("users")
            .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
            .first();

        if (existing) {
            throw new Error("User ID already exists");
        }

        const id = await ctx.db.insert("users", args);
        return id;
    },
});

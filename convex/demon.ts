import { mutation } from "./_generated/server";
import { v } from "convex/values";

// This mutation allows an admin (or during setup) to grant the 'demon' role to a user.
// In a real production app, this should be heavily protected (e.g. require a secret key).
export const grantDemonRole = mutation({
    args: { userId: v.string(), secret: v.string() },
    handler: async (ctx, args) => {
        if (args.secret !== "innovex-demon-secret") {
            throw new Error("Invalid secret key");
        }

        const user = await ctx.db.query("users")
            .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, { role: "demon" });
        return `User ${user.name} is now a Demon.`;
    },
});

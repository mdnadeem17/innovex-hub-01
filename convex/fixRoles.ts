import { mutation } from "./_generated/server";

export const normalizeRoles = mutation({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        for (const user of users) {
            if (user.role && user.role !== user.role.toLowerCase()) {
                await ctx.db.patch(user._id, { role: user.role.toLowerCase() });
            }
        }
        return "Roles normalized";
    },
});

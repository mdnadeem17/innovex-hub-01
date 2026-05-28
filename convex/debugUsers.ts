import { query } from "./_generated/server";

export const listUsers = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        return users.map(u => ({ name: u.name, role: u.role, id: u.user_id }));
    },
});

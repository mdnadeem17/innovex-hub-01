import { query } from "./_generated/server";

export const listGoalsDebug = query({
    args: {},
    handler: async (ctx) => {
        const goals = await ctx.db.query("goals").order("desc").collect();
        return await Promise.all(goals.map(async (goal) => {
            let resolvedUrl = null;
            if (goal.image_url && !goal.image_url.startsWith("http")) {
                resolvedUrl = await ctx.storage.getUrl(goal.image_url);
            }
            return {
                id: goal._id,
                original_image_url: goal.image_url,
                resolved_url: resolvedUrl,
                is_http: goal.image_url?.startsWith("http"),
            };
        }));
    },
});

"use node";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

const PROJECT_IMAGES: Record<string, string> = {
    'Autonomous Robotic Arm': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=60',
    'Neural Network Visualizer': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60',
    'Custom PCB Design Lab': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop&q=60',
    'Autonomous Survey Drone': 'https://images.unsplash.com/photo-1506947411487-a56738267384?w=800&auto=format&fit=crop&q=60'
};

const GOAL_IMAGES: Record<string, string> = {
    "Launch student mentorship program": "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=60",
    "Expand the robotics lab with new equipment": "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=60",
    "Host a regional hackathon": "https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&auto=format&fit=crop&q=60"
};

export const run = action({
    args: {},
    handler: async (ctx) => {
        console.log("Starting image migration...");

        // 1. Migrate Projects
        const projects = await ctx.runQuery(api.projects.list);
        for (const p of projects) {
            // Only migrate if it has a matching title and NO valid image yet (or empty/placeholder)
            // We check if image_url is missing or "no-image" or similar.
            // Actually, let's just force update if we have a match, to ensure high quality images.
            const targetUrl = PROJECT_IMAGES[p.title as string];

            if (targetUrl) {
                console.log(`Migrating project: ${p.title}`);
                try {
                    const response = await fetch(targetUrl);
                    if (!response.ok) throw new Error(`Failed to fetch ${targetUrl}`);
                    const blob = await response.blob();
                    const storageId = await ctx.storage.store(blob);

                    await ctx.runMutation(api.projects.update, {
                        id: p._id,
                        image_url: storageId
                    });
                    console.log(`Updated ${p.title} with storageId: ${storageId}`);
                } catch (e) {
                    console.error(`Failed to migrate ${p.title}:`, e);
                }
            }
        }

        // 2. Migrate Goals
        const goals = await ctx.runQuery(api.goals.list);
        for (const g of goals) {
            const targetUrl = GOAL_IMAGES[g.text as string];

            if (targetUrl) {
                console.log(`Migrating goal: ${g.text}`);
                try {
                    const response = await fetch(targetUrl);
                    if (!response.ok) throw new Error(`Failed to fetch ${targetUrl}`);
                    const blob = await response.blob();
                    const storageId = await ctx.storage.store(blob);

                    await ctx.runMutation(api.goals.update, {
                        id: g._id,
                        image_url: storageId
                    });
                    console.log(`Updated goal ${g.text} with storageId: ${storageId}`);
                } catch (e) {
                    console.error(`Failed to migrate goal ${g.text}:`, e);
                }
            }
        }

        return "Migration complete!";
    },
});

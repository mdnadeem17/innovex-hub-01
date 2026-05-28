import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: { id: v.id("participations") },
    handler: async (ctx, args) => {
        const participation = await ctx.db.get(args.id);
        if (!participation) return null;

        let imageUrl = participation.image_url;
        if (imageUrl && !imageUrl.startsWith("http")) {
            try {
                imageUrl = (await ctx.storage.getUrl(imageUrl)) || imageUrl;
            } catch (e) { }
        }

        return {
            ...participation,
            image_url: imageUrl,
        };
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        const participations = await ctx.db.query("participations")
            .filter(q => q.or(
                q.eq(q.field("status"), "approved"),
                q.eq(q.field("status"), undefined)
            ))
            .order("desc").collect();
        return await Promise.all(participations.map(async (a) => {
            let imageUrl = a.image_url;
            if (imageUrl && !imageUrl.startsWith("http")) {
                try {
                    const url = await ctx.storage.getUrl(imageUrl);
                    imageUrl = url || "";
                } catch (e) {
                    imageUrl = "";
                }
            }
            return { ...a, image_url: imageUrl };
        }));
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(), // HTML content
        image_url: v.string(),
        event_name: v.string(),
        date: v.string(),
        certificate_link: v.optional(v.string()),
        created_at: v.string(),
        created_by: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const newparticipation = {
            ...args,
            status: 'pending',
            created_by: args.created_by,
        };
        return await ctx.db.insert("participations", newparticipation);
    },
});

export const myparticipations = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const participations = await ctx.db.query("participations")
            .filter(q => q.eq(q.field("created_by"), args.userId))
            .order("desc").collect();

        return await Promise.all(participations.map(async (a) => {
            let imageUrl = a.image_url;
            if (imageUrl && !imageUrl.startsWith("http")) {
                try {
                    const url = await ctx.storage.getUrl(imageUrl);
                    imageUrl = url || "";
                } catch (e) {
                    imageUrl = "";
                }
            }
            return { ...a, image_url: imageUrl };
        }));
    },
});

export const listPending = query({
    args: {},
    handler: async (ctx) => {
        const participations = await ctx.db.query("participations")
            .filter(q => q.eq(q.field("status"), "pending"))
            .order("desc").collect();

        return await Promise.all(participations.map(async (a) => {
            let imageUrl = a.image_url;
            if (imageUrl && !imageUrl.startsWith("http")) {
                try {
                    const url = await ctx.storage.getUrl(imageUrl);
                    imageUrl = url || "";
                } catch (e) {
                    imageUrl = "";
                }
            }
            return { ...a, image_url: imageUrl };
        }));
    },
});

export const approve = mutation({
    args: { id: v.id("participations") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: 'approved' });
    },
});

export const reject = mutation({
    args: { id: v.id("participations") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const update = mutation({
    args: {
        id: v.id("participations"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        image_url: v.optional(v.string()),
        event_name: v.optional(v.string()),
        date: v.optional(v.string()),
        certificate_link: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const deleteparticipation = mutation({
    args: { id: v.id("participations") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

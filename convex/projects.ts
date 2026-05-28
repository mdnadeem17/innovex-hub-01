import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.id);
        if (!project) return null;

        let imageUrl = project.image_url;
        if (imageUrl && !imageUrl.startsWith("http")) {
            try {
                imageUrl = (await ctx.storage.getUrl(imageUrl)) || imageUrl;
            } catch (e) { }
        }

        return {
            ...project,
            image_url: imageUrl,
        };
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.db.query("projects")
            .filter(q => q.or(
                q.eq(q.field("status"), "approved"),
                q.eq(q.field("status"), undefined)
            ))
            .order("desc").collect();
        return await Promise.all(projects.map(async (p) => {
            let imageUrl = p.image_url;
            if (imageUrl && !imageUrl.startsWith("http")) {
                try {
                    const url = await ctx.storage.getUrl(imageUrl);
                    imageUrl = url || "";
                } catch (e) {
                    imageUrl = "";
                }
            }
            return { ...p, image_url: imageUrl };
        }));
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(), // HTML content
        image_url: v.string(),
        components: v.string(), // Comma separated
        source_code: v.string(), // Link or text
        video_link: v.optional(v.string()), // Optional video
        created_at: v.string(),
        created_by: v.optional(v.string()),
    },
    handler: async (ctx, args) => {

        const newProject = {
            ...args,
            status: 'pending',
            created_by: args.created_by,
        };
        return await ctx.db.insert("projects", newProject);
    },
});

export const myProjects = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const projects = await ctx.db.query("projects")
            .filter(q => q.eq(q.field("created_by"), args.userId))
            .order("desc").collect();

        return await Promise.all(projects.map(async (p) => {
            let imageUrl = p.image_url;
            if (imageUrl && !imageUrl.startsWith("http")) {
                try {
                    const url = await ctx.storage.getUrl(imageUrl);
                    imageUrl = url || "";
                } catch (e) {
                    imageUrl = "";
                }
            }
            return { ...p, image_url: imageUrl };
        }));
    },
});

export const listPending = query({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.db.query("projects")
            .filter(q => q.eq(q.field("status"), "pending"))
            .order("desc").collect();

        return await Promise.all(projects.map(async (p) => {
            let imageUrl = p.image_url;
            if (imageUrl && !imageUrl.startsWith("http")) {
                try {
                    const url = await ctx.storage.getUrl(imageUrl);
                    imageUrl = url || "";
                } catch (e) {
                    imageUrl = "";
                }
            }
            return { ...p, image_url: imageUrl };
        }));
    },
});

export const approve = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: 'approved' });
    },
});

export const reject = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});


export const update = mutation({
    args: {
        id: v.id("projects"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        image_url: v.optional(v.string()),
        components: v.optional(v.string()),
        source_code: v.optional(v.string()),
        video_link: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const deleteProject = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        user_id: v.string(), // This is the login ID (e.g. email or username)
        password: v.string(), // Plaintext password as per request
        name: v.string(),
        college: v.optional(v.string()),
        role: v.string(), // 'guest' | 'member' | 'admin'
    }).index("by_user_id", ["user_id"]),

    projects: defineTable({
        title: v.string(),
        description: v.string(),
        image_url: v.string(), // Storage ID or URL
        components: v.string(),
        source_code: v.string(),
        video_link: v.optional(v.string()), // Can be null in supabase, optional here
        created_at: v.string(), // ISO string
        status: v.optional(v.string()), // 'pending', 'approved', 'rejected'
        created_by: v.optional(v.string()), // user_id of creator
        approvals: v.optional(v.array(v.string())), // list of admin/user ids who approved? or just generic array for now to suppress error
    }),

    achievements: defineTable({
        title: v.string(),
        description: v.string(),
        image_url: v.string(),
        event_name: v.string(),
        date: v.string(),
        certificate_link: v.optional(v.string()),
        created_at: v.string(),
        status: v.optional(v.string()), // 'pending', 'approved', 'rejected'
        created_by: v.optional(v.string()),
        approvals: v.optional(v.array(v.string())),
    }),

    participations: defineTable({
        title: v.string(),
        description: v.string(),
        image_url: v.string(),
        event_name: v.string(),
        date: v.string(),
        certificate_link: v.optional(v.string()),
        created_at: v.string(),
        status: v.optional(v.string()), // 'pending', 'approved', 'rejected'
        created_by: v.optional(v.string()),
        approvals: v.optional(v.array(v.string())),
    }),


    goals: defineTable({
        text: v.string(),
        image_url: v.string(),
        created_at: v.string(),
    }),

    memories: defineTable({
        project_id: v.id("projects"),
        title: v.string(),
        description: v.string(),
        image_url: v.string(),
        category: v.string(), // Building, Participation, Fun, etc.
        date: v.string(),
        type: v.string(), // 'image' | 'video'
    }).index("by_project_id", ["project_id"]),

    achievement_memories: defineTable({
        achievement_id: v.id("achievements"),
        title: v.string(),
        description: v.string(),
        image_url: v.string(),
        category: v.string(), // Building, Participation, Fun, etc.
        date: v.string(),
        type: v.string(), // 'image' | 'video'
    }).index("by_achievement_id", ["achievement_id"]),

    participation_memories: defineTable({
        participation_id: v.id("participations"),
        title: v.string(),
        description: v.string(),
        image_url: v.string(),
        category: v.string(), // Building, Participation, Fun, etc.
        date: v.string(),
        type: v.string(), // 'image' | 'video'
    }).index("by_participation_id", ["participation_id"]),
});

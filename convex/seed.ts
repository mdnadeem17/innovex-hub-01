import { mutation } from "./_generated/server";

export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Projects
        const projects = [
            {
                title: 'Autonomous Robotic Arm',
                description: 'A 6-DOF robotic arm with computer vision integration for precise assembly tasks. Built with Arduino Mega, servo motors, and OpenCV for real-time object detection and manipulation in the engineering lab.',
                image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=60',
                components: 'Arduino Mega, 6x MG996R Servos, Pi Camera, OpenCV, 3D Printed Parts, PCA9685 Driver',
                video_link: 'https://example.com/video1',
                source_code: 'https://github.com/innovex/robotic-arm',
                created_at: new Date().toISOString(),
            },
            {
                title: 'Neural Network Visualizer',
                description: 'An interactive real-time visualization tool for neural network architectures and training processes. Watch data flow through layers, observe gradient descent, and understand backpropagation visually.',
                image_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60',
                components: 'Python, TensorFlow, Three.js, WebGL, React, WebSocket Server',
                video_link: 'https://example.com/video2',
                source_code: 'https://github.com/innovex/nn-visualizer',
                created_at: new Date().toISOString(),
            },
            {
                title: 'Custom PCB Design Lab',
                description: 'Complete PCB design and fabrication workflow — from schematic capture to etching. Includes a reflow soldering station and automated optical inspection system built from scratch.',
                image_url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop&q=60',
                components: 'KiCad, CNC Mill, UV Exposure Unit, Reflow Oven, AOI Camera System',
                video_link: 'https://example.com/video3',
                source_code: 'https://github.com/innovex/pcb-lab',
                created_at: new Date().toISOString(),
            },
            {
                title: 'Autonomous Survey Drone',
                description: 'A custom-built quadcopter with autonomous flight capabilities, LIDAR mapping, and real-time telemetry. Designed for environmental monitoring and terrain surveying missions.',
                image_url: 'https://images.unsplash.com/photo-1506947411487-a56738267384?w=800&auto=format&fit=crop&q=60',
                components: 'Pixhawk FC, LIDAR Lite v3, Raspberry Pi 4, GPS Module, 4G Telemetry',
                video_link: 'https://example.com/video4',
                source_code: 'https://github.com/innovex/survey-drone',
                created_at: new Date().toISOString(),
            },
        ];

        for (const p of projects) {
            const existing = await ctx.db.query("projects").filter(q => q.eq(q.field("title"), p.title)).first();
            if (!existing) {
                await ctx.db.insert("projects", p);
            } else if (!existing.image_url) {
                // Backfill image if missing
                await ctx.db.patch(existing._id, { image_url: p.image_url });
            }
        }

        // 2. Future Goals
        const goals = [
            {
                text: "Launch student mentorship program",
                image_url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=60",
                created_at: new Date().toISOString()
            },
            {
                text: "Expand the robotics lab with new equipment",
                image_url: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=60",
                created_at: new Date().toISOString()
            },
            {
                text: "Host a regional hackathon",
                image_url: "https://images.unsplash.com/photo-1504384308090-c54be3855833?w=800&auto=format&fit=crop&q=60",
                created_at: new Date().toISOString()
            },
        ];

        for (const g of goals) {
            const existing = await ctx.db.query("goals").filter(q => q.eq(q.field("text"), g.text)).first();
            if (!existing) {
                await ctx.db.insert("goals", g);
            } else if (!existing.image_url) {
                // Backfill image if missing
                await ctx.db.patch(existing._id, { image_url: g.image_url });
            }
        }

        return "Database seeded and updated successfully!";
    },
});

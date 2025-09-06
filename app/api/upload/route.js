import cloudinary from "@/lib/cloudinary";
import { rateLimiter } from "@/middleware/rateLimiter";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(request) {
    try {
        // ✅ Rate limiting
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!rateLimiter(ip)) {
            return new Response("Too many requests", { status: 429 });
        }

        // ✅ Get logged-in user
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return new Response("Unauthorized", { status: 401 });
        }

        // ✅ Parse body
        const { imageBase64, caption } = await request.json();
        if (!imageBase64) {
            return new Response("No image provided", { status: 400 });
        }

        // ✅ Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
            folder: "instagram-clone",
            resource_type: "image",
        });

        // ✅ Save post in MongoDB
        await connectToDB();
        const newPost = new Post({
            author: session.user.id, // user ID from session
            imageUrl: uploadResponse.secure_url,
            caption: caption || "",
        });

        await newPost.save();

        return new Response(JSON.stringify({ success: true, post: newPost }), {
            status: 201,
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500 }
        );
    }
}

// app/api/posts/[id]/comments/route.js
import connectToDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request, { params }) {
    try {
        await connectToDB();
        console.log(" Connected to DB");

        // Get logged in user
        const session = await getServerSession(authOptions);
        console.log(" Session:", session);

        if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find post
        const post = await Post.findById(params.id);
        console.log(" Post found:", post?._id);

        if (!post) {
            return new Response(JSON.stringify({ error: "Post not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Get request body
        const body = await request.json();
        console.log("Request body:", body);

        if (!body.text || !body.text.trim()) {
            return new Response(JSON.stringify({ error: "Comment text is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create comment
        const comment = new Comment({
            post: post._id,
            author: session.user.id,
            text: body.text.trim(),
        });

        await comment.save();
        console.log(" Comment saved:", comment);

        // Push comment into post
        post.comments.push(comment._id);
        await post.save();
        console.log(" Comment added to post");

        // Safely populate author
        try {
            await comment.populate("author", "username avatar");
        } catch (err) {
            console.warn(" Populate failed, returning raw author ID:", err.message);
        }

        return new Response(JSON.stringify(comment), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(" Comment API Error:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

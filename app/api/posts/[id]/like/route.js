import connectToDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req, { params }) {
    try {
        await connectToDB();

        const postId = params?.id;
        if (!postId) {
            return new Response(JSON.stringify({ error: "Post ID missing" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return new Response(JSON.stringify({ error: "Post not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const userId = session.user.id.toString();
        let liked = false;

        // Ensure likes is always an array
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }

        // Toggle like/unlike
        const index = post.likes.findIndex(
            (id) => id.toString() === userId
        );

        if (index > -1) {
            // unlike
            post.likes.splice(index, 1);
        } else {
            // like
            post.likes.push(userId);
            liked = true;
        }

        await post.save();

        return new Response(
            JSON.stringify({ likes: post.likes.length, liked }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Like API Error:", error);
        return new Response(
            JSON.stringify({
                error: error.message || "Internal Server Error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

import connectToDB from "../../../../lib/mongodb";
import Post from "../../../../models/Post";
import { requireAuth } from "../../../../middleware/authMiddleware";
import { rateLimiter } from "../../../../middleware/rateLimiter";
import Comment from "../../../../models/Comment";

async function handler(request, { params }) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimiter(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429, headers: { "Content-Type": "application/json" } });
    }

    await connectToDB();

    // Fetch post with populates
    const post = await Post.findById(params.id)
      .populate("author", "username avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      });

    if (!post) return new Response(JSON.stringify({ error: "Post not found" }), { status: 404, headers: { "Content-Type": "application/json" } });

    // Normalize likes array
    const likesArray = Array.isArray(post.likes) ? post.likes : [];

    // Optional session for liked flag
    let currentUserId = null;
    if (request.method === "GET") {
      const session = await requireAuth(request).catch(() => null);
      currentUserId = session?.user?.id;

      const responsePost = {
        ...post._doc,
        likes: likesArray.length,
        liked: currentUserId ? likesArray.some(id => id.toString() === currentUserId) : false,
      };

      return new Response(JSON.stringify(responsePost), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // PATCH: update post (caption)
    if (request.method === "PATCH") {
      const session = await requireAuth(request);
      if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

      if (post.author._id.toString() !== session.user.id) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
      }

      const body = await request.json();
      if (body.caption !== undefined) post.caption = body.caption;
      await post.save();

      // Return likes count and liked flag
      const responsePost = {
        ...post._doc,
        likes: likesArray.length,
        liked: true, // user owns the post
      };

      return new Response(JSON.stringify(responsePost), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // DELETE: delete post
    if (request.method === "DELETE") {
      const session = await requireAuth(request);
      if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });

      if (post.author._id.toString() !== session.user.id) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
      }

      await post.deleteOne();
      return new Response(JSON.stringify({ message: "Post deleted" }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Post ID API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

// Export handlers for App Router
export async function GET(request, { params }) { return handler(request, { params }); }
export async function PATCH(request, { params }) { return handler(request, { params }); }
export async function DELETE(request, { params }) { return handler(request, { params }); }

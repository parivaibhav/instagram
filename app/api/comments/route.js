import connectToDB from "../../../lib/mongodb";
import Comment from "../../../models/Comment";
import Post from "../../../models/Post";
import { requireAuth } from "../../../middleware/authMiddleware";
import { rateLimiter } from "../../../middleware/rateLimiter";

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimiter(ip)) {
      return new Response("Too many requests", { status: 429 });
    }

    const session = await requireAuth();

    const { postId, content } = await request.json();
    if (!postId || !content)
      return new Response("Missing postId or content", { status: 400 });

    await connectToDB();

    const comment = new Comment({
      post: postId,
      author: session.user.id,
      content,
    });

    await comment.save();

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    return new Response(JSON.stringify(comment), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

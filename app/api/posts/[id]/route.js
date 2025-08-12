import connectToDB from "../../../../lib/mongodb";
import Post from "../../../../models/Post";
import { requireAuth } from "../../../../middleware/authMiddleware";
import { rateLimiter } from "../../../../middleware/rateLimiter";

async function handler(request, params) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimiter(ip)) {
    return new Response("Too many requests", { status: 429 });
  }

  await connectToDB();

  const post = await Post.findById(params.id);
  if (!post) return new Response("Post not found", { status: 404 });

  if (request.method === "GET") {
    await post.populate("author", "username avatar");
    await post.populate({
      path: "comments",
      populate: { path: "author", select: "username avatar" },
    });
    return new Response(JSON.stringify(post), { status: 200 });
  }

  if (request.method === "PATCH") {
    const session = await requireAuth();
    if (post.author.toString() !== session.user.id)
      return new Response("Forbidden", { status: 403 });

    const body = await request.json();
    if (body.caption !== undefined) post.caption = body.caption;
    await post.save();

    return new Response(JSON.stringify(post), { status: 200 });
  }

  if (request.method === "DELETE") {
    const session = await requireAuth();
    if (post.author.toString() !== session.user.id)
      return new Response("Forbidden", { status: 403 });

    await post.deleteOne();
    return new Response("Post deleted", { status: 200 });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

export async function GET(request, { params }) {
  try {
    return await handler(request, params);
  } catch (error) {
    console.error(error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    return await handler(request, params);
  } catch (error) {
    console.error(error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    return await handler(request, params);
  } catch (error) {
    console.error(error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

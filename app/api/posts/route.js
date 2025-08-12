import connectToDB from "../../../lib/mongodb";
import Post from "../../../models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { requireAuth } from "../../../middleware/authMiddleware";
import { rateLimiter } from "../../../middleware/rateLimiter";

async function handler(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimiter(ip)) {
    return new Response("Too many requests", { status: 429 });
  }

  await connectToDB();

  if (request.method === "GET") {
    const posts = await Post.find({})
      .populate("author", "username avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username avatar" },
      })
      .sort({ createdAt: -1 });
    return new Response(JSON.stringify(posts), { status: 200 });
  }

  if (request.method === "POST") {
    const session = await requireAuth();

    const { imageUrl, caption } = await request.json();

    const newPost = new Post({
      author: session.user.id,
      imageUrl,
      caption,
    });

    await newPost.save();

    return new Response(JSON.stringify(newPost), { status: 201 });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

export async function GET(request) {
  try {
    return await handler(request);
  } catch (error) {
    console.error(error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  try {
    return await handler(request);
  } catch (error) {
    console.error(error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

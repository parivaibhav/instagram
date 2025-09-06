// app/api/posts/route.js
import connectToDB from "../../../lib/mongodb";
import Post from "../../../models/Post";
import User from "../../../models/User";
import Comment from "../../../models/Comment";
import { requireAuth } from "../../../middleware/authMiddleware";
import { rateLimiter } from "../../../middleware/rateLimiter";

async function handler(request) {
  try {
    // 🌐 Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("remote-addr") ||
      "unknown";
    if (!rateLimiter(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests" }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await connectToDB();

    /**
     * 📌 GET: fetch posts
     */
    if (request.method === "GET") {
      const session = await requireAuth(request).catch(() => null); // optional
      const currentUserId = session?.user?.id;

      const { searchParams } = new URL(request.url);
      const queryUserId = searchParams.get("userId");
      const username = searchParams.get("username");
      const followingOnly = searchParams.get("following");

      let query = {};

      if (queryUserId && !followingOnly) {
        query = { author: queryUserId };
      } else if (username) {
        const user = await User.findOne({ username }).select("_id");
        if (!user) {
          return new Response(
            JSON.stringify({ error: "User not found" }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        query = { author: user._id };
      }

      if (queryUserId && followingOnly === "true") {
        const currentUser = await User.findById(queryUserId).select("following");
        if (!currentUser) {
          return new Response(
            JSON.stringify({ error: "User not found" }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        query = { author: { $in: currentUser.following } };
      }

      const posts = await Post.find(query)
        .populate("author", "username avatar")
        .populate({
          path: "comments",
          populate: { path: "author", select: "username avatar" },
        })
        .sort({ createdAt: -1 });

      // 🔧 Normalize likes
      const postsWithLikes = posts.map((post) => {
        const likesArray = Array.isArray(post.likes) ? post.likes : [];
        return {
          ...post._doc,
          likes: likesArray.map((id) => id.toString()), // array of userIds
          likesCount: likesArray.length, // total likes
          liked: currentUserId
            ? likesArray.some((id) => id.toString() === currentUserId)
            : false,
        };
      });

      return new Response(JSON.stringify(postsWithLikes), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    /**
     * 📌 POST: create new post
     */
    if (request.method === "POST") {
      const session = await requireAuth(request);
      if (!session?.user?.id) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const { imageUrl, caption } = await request.json();
      if (!imageUrl) {
        return new Response(
          JSON.stringify({ error: "Image is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const newPost = new Post({
        author: session.user.id,
        imageUrl,
        caption: caption || "",
        likes: [], // always initialize
      });

      await newPost.save();

      return new Response(
        JSON.stringify({
          ...newPost._doc,
          likes: [],
          likesCount: 0,
          liked: false,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ❌ Unsupported method
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API Error in /api/posts:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ✅ Next.js route handlers
export async function GET(request) {
  return handler(request);
}
export async function POST(request) {
  return handler(request);
}

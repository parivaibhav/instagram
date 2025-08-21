import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    const { username } = params;

    await connectToDB();

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ normalize response
    const userData = {
      id: user._id.toString(),
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
      bio: user.bio,
      postsCount: user.postsCount || 0,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      followers: user.followers || [],
      following: user.following || [],
    };

    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import connectToDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import { rateLimiter } from "../../../../middleware/rateLimiter";

export async function GET(request, { params }) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimiter(ip)) {
      return new Response("Too many requests", { status: 429 });
    }

    await connectToDB();

    const user = await User.findOne({ username: params.username }).select(
      "-password"
    );

    if (!user) return new Response("User not found", { status: 404 });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

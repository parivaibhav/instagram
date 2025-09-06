
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        });
    }

    await connectToDB();
    const user = await User.findOne({ email: session.user.email }).select("avatar");

    return new Response(JSON.stringify({ avatar: user?.avatar || null }), {
        status: 200,
    });
}

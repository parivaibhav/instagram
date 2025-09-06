import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) {
            return new Response(JSON.stringify([]), { status: 200 });
        }

        const users = await User.find({
            username: { $regex: query, $options: "i" }
        }).select("username avatar name");

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
        });
    }
}

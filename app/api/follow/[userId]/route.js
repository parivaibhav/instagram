import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(JSON.stringify({ isFollowing: false }), { status: 200 });
        }

        const { userId } = await params;
        const currentUserId = session.user.id;

        const currentUser = await User.findById(currentUserId);

        const isFollowing = currentUser.following.includes(userId);

        return new Response(JSON.stringify({ isFollowing }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function POST(req, { params }) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const { userId } = await params;
        const currentUserId = session.user.id;

        if (userId === currentUserId) {
            return new Response(JSON.stringify({ error: "You can't follow yourself" }), { status: 400 });
        }

        await User.findByIdAndUpdate(userId, { $addToSet: { followers: currentUserId } });
        await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: userId } });

        return new Response(JSON.stringify({ isFollowing: true }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const { userId } = await params;
        const currentUserId = session.user.id;

        await User.findByIdAndUpdate(userId, { $pull: { followers: currentUserId } });
        await User.findByIdAndUpdate(currentUserId, { $pull: { following: userId } });

        return new Response(JSON.stringify({ isFollowing: false }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}

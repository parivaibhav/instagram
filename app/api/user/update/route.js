import { getServerSession } from "next-auth/next";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { username, bio, avatarFile } = await req.json();

        await connectToDB();

        // Check if the new username is already taken by another user
        const existingUser = await User.findOne({
            username,
            email: { $ne: session.user.email },
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "Username is already taken" }),
                { status: 400 }
            );
        }

        // Upload new avatar if provided
        let avatarUrl = null;
        if (avatarFile) {
            const uploadResponse = await cloudinary.uploader.upload(avatarFile, {
                folder: "profiles",
                width: 200,
                height: 200,
                crop: "fill",
            });
            avatarUrl = uploadResponse.secure_url;
        }

        // Update user in DB
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email }, // query only by email
            {
                username,
                bio,
                ...(avatarUrl && { avatar: avatarUrl }),
            },
            { new: true }
        );

        // Prepare updated session object
        const updatedSession = {
            ...session,
            user: {
                ...session.user,
                username: updatedUser.username,
                image: avatarUrl || session.user.image,
            },
        };

        return new Response(
            JSON.stringify({ user: updatedUser, session: updatedSession }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: "Server error" }),
            { status: 500 }
        );
    }
}

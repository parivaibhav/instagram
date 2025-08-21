import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    await connectToDB();
    const { token, password } = await req.json();

    if (!token || !password)
        return new Response(
            JSON.stringify({ error: "Invalid request" }),
            { status: 400 }
        );

    // Find user by resetPasswordToken and check expiry
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
    });

    if (!user)
        return new Response(
            JSON.stringify({ error: "Token expired or invalid" }),
            { status: 400 }
        );

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return new Response(
        JSON.stringify({ message: "Password reset successful!" }),
        { status: 200 }
    );
}

import { Resend } from "resend";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    await connectToDB();

    try {
        const { email } = await req.json();
        if (!email)
            return new Response(JSON.stringify({ error: "Email required" }), {
                status: 400,
            });

        const user = await User.findOne({ email });
        if (!user)
            return new Response(
                JSON.stringify({ message: "If this email exists, reset link sent" }),
                { status: 200 }
            );

        // Generate 5-min token
        const resetToken = Math.random().toString(36).substring(2, 15);
        const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save token to DB using correct schema fields
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = expires;
        await user.save();

        const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

        // Send email using Resend
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            html: `<p>Click the link below to reset your password. Link expires in 5 minutes:</p>
             <a href="${resetLink}">${resetLink}</a>`,
        });

        return new Response(JSON.stringify({ message: "Reset link sent" }), {
            status: 200,
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Failed to send email" }), {
            status: 500,
        });
    }
}

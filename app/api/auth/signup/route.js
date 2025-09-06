import connectToDB from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, username, fullName, password } = await req.json();

        if (!email || !username || !fullName || !password) {
            return new Response("Missing required fields", { status: 400 });
        }

        // Password validation: min 6 chars and at least one symbol
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return new Response(
                "Password must be at least 6 characters long and contain at least one symbol",
                { status: 400 }
            );
        }

        await connectToDB();

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return new Response("Email or username already exists", { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            username,
            fullName,
            password: hashedPassword,
        });

        await newUser.save();

        return new Response("User created successfully", { status: 201 });
    } catch (err) {
        console.error(err);
        return new Response("Internal Server Error", { status: 500 });
    }
}

    import NextAuth from "next-auth";
    import CredentialsProvider from "next-auth/providers/credentials";
    import connectToDB from "./mongodb";
    import User from "../models/User";
    import bcrypt from "bcryptjs";

    export const authOptions = {
        session: {
            strategy: "jwt",
        },
        providers: [
            CredentialsProvider({
                name: "Credentials",
                credentials: {
                    identifier: { label: "Email / Username / Mobile", type: "text" },
                    password: { label: "Password", type: "password" },
                },
                async authorize(credentials) {
                    await connectToDB();

                    const user = await User.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { mobile: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        throw new Error("Invalid credentials");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.username,
                        email: user.email,
                        image: user.avatar || null,
                    };
                },
            }),
        ],
        secret: process.env.NEXTAUTH_SECRET,
        pages: {
            signIn: "/auth/login",
        },
        callbacks: {
            async jwt({ token, user }) {
                if (user) {
                    token.id = user.id;
                }
                return token;
            },
            async session({ session, token }) {
                if (token) {
                    session.user.id = token.id;
                }
                return session;
            },
        },
    };

    export default NextAuth(authOptions);

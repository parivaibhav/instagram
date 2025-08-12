import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";

export async function requireAuth() {
    const session = await getServerSession(authOptions);
    if (!session) {
        const error = new Error("Unauthorized");
        error.status = 401;
        throw error;
    }
    return session;
}

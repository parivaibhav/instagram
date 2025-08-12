"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PATHS = ["/auth/login", "/auth/signup", "/auth/forgot-password"];

export default function ProtectedRoute({ children }) {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If user is NOT logged in AND is trying to access a protected page:
        if (
            status === "unauthenticated" &&
            !PUBLIC_PATHS.includes(pathname)
        ) {
            router.push("/auth/login");
        }
    }, [status, router, pathname]);

    if (status === "loading") return <p>Loading...</p>;

    // Allow access to public pages without login
    if (PUBLIC_PATHS.includes(pathname)) return children;

    // For authenticated users, show the page
    if (status === "authenticated") return children;

    return null;
}

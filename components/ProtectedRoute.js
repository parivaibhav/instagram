"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PATHS = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password"  // ✅ added reset-password as public
];

export default function ProtectedRoute({ children }) {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "unauthenticated" && !PUBLIC_PATHS.includes(pathname)) {
            router.push("/auth/login");
        }
    }, [status, router, pathname]);

    if (status === "loading") return <p>Loading...</p>;

    if (PUBLIC_PATHS.includes(pathname)) return children;

    if (status === "authenticated") return children;

    return null;
}

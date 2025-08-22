"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import Image from "next/image";


const PUBLIC_PATHS = [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
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

    //  Instagram-like splash loader
    if (status === "loading") {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center">
                {/* Mobile: Only Loader */}
                <div className="flex flex-col items-center justify-center w-full md:hidden">
                    <div className="mt-6 w-10 h-10 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                </div>

                {/* Desktop: Only Instagram + Meta */}
                <div className="hidden md:flex w-full h-full bg-black flex-col items-center justify-between py-10">
                    {/* Centered Image */}
                    <div className="flex-1 flex items-center justify-center">
                        <Image
                            src="/images/logo.png"
                            alt="Instagram Preview"
                            width={80}
                            height={80}
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-2 mb-5 text-gray-500">
                        <FaMeta className="text-xl" />
                        <span className="text-xl">from Meta</span>
                    </div>
                </div>

            </div>
        );
    }

    if (PUBLIC_PATHS.includes(pathname)) return children;
    if (status === "authenticated") return children;

    return null;
}

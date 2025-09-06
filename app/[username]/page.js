"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Feed/SideBar";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfilePosts from "@/components/Profile/ProfilePosts";
import MobileBar from "@/components/Profile/MobileBar";

export default function ProfilePage() {
    const params = useParams();
    const username = Array.isArray(params.username)
        ? params.username[0]
        : params.username;

    const [userExists, setUserExists] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) {
            setUserExists(false);
            setLoading(false);
            return;
        }

        const checkUser = async () => {
            try {
                const res = await fetch(`/api/${username}`);
                const data = await res.json();
                console.log("🔎 API response:", data); // 👈 see what API gives

                if (res.ok) {
                    // Adjust based on API format
                    if (data?.user || data?._id || data?.username) {
                        setUserExists(true);
                    } else {
                        setUserExists(false);
                    }
                } else {
                    setUserExists(false);
                }
            } catch (err) {
                console.error(" API error:", err);
                setUserExists(false);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [username]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-gray-400">
                Loading profile...
            </div>
        );
    }

    if (!userExists) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-gray-400">
                <h1 className="text-2xl font-semibold mb-2">⚠️ Profile Not Found</h1>
                <p className="text-sm text-gray-500">This user does not exist.</p>
            </div>
        );
    }

    return (
        <div className="ml-0 md:ml-18 bg-black min-h-screen text-white">
            <MobileBar />
            <Sidebar />
            <main className="flex-1 max-w-5xl mx-auto px-4 pt-8 pb-16 md:mx-auto">
                <ProfileHeader username={username} />
                <div className="border-t border-gray-700 my-2"></div>
                <ProfilePosts username={username} />
            </main>
        </div>
    );
}

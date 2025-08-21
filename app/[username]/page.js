"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Feed/SideBar";
import EditProfileModal from "@/components/Profile/EditProfileModel";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfilePosts from "@/components/Profile/ProfilePosts";

export default function ProfilePage() {
    const params = useParams();
    const username = Array.isArray(params.username) ? params.username[0] : params.username;

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!username) {
        return (
            <div className="flex items-center justify-center h-screen text-white">
                No username in URL
            </div>
        );
    }

    return (
        <div className="flex bg-black min-h-screen text-white">
            <Sidebar />
            <main className="flex-1 max-w-5xl mx-auto px-4 pt-8 pb-16 md:mx-auto">
                <ProfileHeader username={username} />

                {/* Profile posts for this user */}
                <ProfilePosts username={username} />

                {isModalOpen && (
                    <EditProfileModal
                        onClose={() => setIsModalOpen(false)}
                        onSave={() => { }}
                    />
                )}
            </main>
        </div>
    );
}

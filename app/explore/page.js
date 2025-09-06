"use client";

import Sidebar from "@/components/Feed/SideBar";
import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function ExplorePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/posts?random=true", { cache: "no-store" });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to fetch posts");
                }

                const data = await res.json();
                setPosts(data);
            } catch (err) {
                console.error("Error fetching posts:", err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <p className="text-center mt-8 text-gray-400">Loading posts...</p>;
    }

    if (!posts.length) {
        return <p className="text-center mt-8 text-gray-400">No posts available.</p>;
    }

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="max-w-7xl mx-auto flex md:px-4 py-6 gap-6">
                <Sidebar />

                <main className="flex-1 ml-0 md:ml-16 ">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 ms-3 border-b border-gray-800 pb-4">
                        Explore
                    </h1>

                    {/* 2-column responsive grid */}
                    <div className="grid grid-cols-3 gap-1  pb-20 md:pb-0">
                        {posts.map((post) => (
                            <Link
                                key={post._id}
                                href={`/post/${post._id}`}
                                className="relative group w-full aspect-square overflow-hidden  shadow-lg cursor-pointer"
                            >
                                <Image
                                    src={post.imageUrl}
                                    alt={post.caption || "Explore post"}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                />

                                {/* Hover overlay with likes/comments */}
                                {/* Hover overlay with likes/comments */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                                    <div className="flex items-center gap-1 text-white font-semibold">
                                        <AiFillHeart className="text-red-500" size={20} />
                                        <span>
                                            {Array.isArray(post.likes) ? post.likes.length : post.likes || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white font-semibold">
                                        <FaRegComment size={18} />
                                        <span>
                                            {Array.isArray(post.comments) ? post.comments.length : 0}
                                        </span>
                                    </div>
                                </div>

                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

"use client";

import Sidebar from "@/components/Feed/SideBar";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";

export default function ExplorePage() {
    const exploreImages = [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
    ];

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="max-w-7xl mx-auto flex px-4 py-6 gap-6">
                <Sidebar />

                <main className="flex-1 ml-0 md:ml-16">
                    <h1 className="text-3xl font-bold ms-3 mb-6 text-[15px] md:text-xl">Explore</h1>

                    {/* Responsive grid: 1 col on xs, 2 cols sm, 3 cols md+ */}
                    <div className="grid grid-cols-3 gap-1 pb-20 md:pb-0">
                        {exploreImages.map((img, idx) => (
                            <div
                                key={idx}
                                className="aspect-square overflow-hidden cursor-pointer group relative  shadow-md"
                            >
                                <img
                                    src={img}
                                    alt={`Explore ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    loading="lazy"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-sm ">
                                    <div className="flex items-center space-x-2 text-white">
                                        <AiFillHeart className="text-red-500" size={18} />
                                        <span>1.2k</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-white">
                                        <FaRegComment size={16} />
                                        <span>250</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

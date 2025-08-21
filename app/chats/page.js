"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Feed/SideBar";

const conversations = [
    {
        id: 1,
        name: "Alice Johnson",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        lastMessage: "Hey! Are we meeting tomorrow?",
        lastTime: "2:45 PM",
    },
    {
        id: 2,
        name: "Bob Smith",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        lastMessage: "Got the files, thanks!",
        lastTime: "Yesterday",
    },
];

export default function ChatListOnly() {
    const router = useRouter();
    const [selectedConv, setSelectedConv] = useState(null);

    const handleChatClick = (conv) => {
        setSelectedConv(conv);
        router.push(`/chats/${conv.id}`); // navigate to chat id page
    };

    return (
        <div className="flex h-screen max-w-7xl ml-0 md:ml-18 text-white bg-black shadow-lg rounded-lg overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Messages List - Full Width */}
            <aside className="flex-1 border-l border-gray-700 flex flex-col bg-black">
                {/* Header */}
                <header className="px-6 py-4 font-bold text-xl border-b border-gray-700">
                    Messages
                </header>

                {/* Conversations */}
                <ul className="flex-1 overflow-auto">
                    {conversations.map((conv) => (
                        <li
                            key={conv.id}
                            className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-900 border-b border-gray-700 transition ${selectedConv?.id === conv.id
                                    ? "bg-gray-900 font-semibold"
                                    : "font-normal"
                                }`}
                            onClick={() => handleChatClick(conv)}
                        >
                            <img
                                src={conv.avatar}
                                alt={conv.name}
                                className="w-14 h-14 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between text-sm truncate">
                                    <span>{conv.name}</span>
                                    <span className="text-gray-400">
                                        {conv.lastTime}
                                    </span>
                                </div>
                                <p className="text-gray-500 truncate">
                                    {conv.lastMessage}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}

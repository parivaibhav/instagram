"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FiArrowLeft,
    FiSend,
    FiPaperclip,
    FiSmile,
    FiMoreVertical,
    FiTrash2,
    FiSearch,
    FiVolumeX,
    FiUserX
} from "react-icons/fi";
import { MdCall } from "react-icons/md";
import { BsCameraVideo } from "react-icons/bs";
import Sidebar from "@/components/Feed/SideBar";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatPage({ params }) {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const emojiRef = useRef(null);
    const menuRef = useRef(null);

    const [messages, setMessages] = useState([
        { id: 1, text: "Hey! How are you?", sender: "them" },
        { id: 2, text: "I’m good! You?", sender: "me" },
        { id: 3, text: "Doing great. Want to catch up later?", sender: "them" },
    ]);

    const handleEmojiClick = (emojiObject) => {
        setMessage((prev) => prev + emojiObject.emoji);
    };

    const handleSend = () => {
        if (!message.trim()) return;
        setMessages((prev) => [...prev, { id: Date.now(), text: message, sender: "me" }]);
        setMessage("");
    };

    const handleDeleteChat = () => {
        if (confirm("Are you sure you want to delete this chat?")) {
            setMessages([]);
            setShowMenu(false);
        }
    };

    // Close emoji picker & menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black">
            <Sidebar />

            <div className="flex flex-col flex-1 ml-0 md:ml-18 relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/chats")}
                            className="text-gray-800 dark:text-gray-200 md:hidden"
                        >
                            <FiArrowLeft size={22} />
                        </button>
                        <img
                            src="https://randomuser.me/api/portraits/men/68.jpg"
                            alt="User"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 dark:text-gray-100">
                                Alice Johnson
                            </span>
                            <span className="text-xs text-green-500 font-medium">
                                Online
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200 relative">
                        <button>
                            <BsCameraVideo size={20} />
                        </button>
                        <button>
                            <MdCall size={22} />
                        </button>
                        <button onClick={() => setShowMenu((prev) => !prev)}>
                            <FiMoreVertical size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div
                                ref={menuRef}
                                className="absolute top-10 right-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 z-50"
                            >
                                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <FiSearch /> Search in Chat
                                </button>
                                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <FiVolumeX /> Mute Notifications
                                </button>
                                <button
                                    onClick={handleDeleteChat}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-50 dark:hover:bg-red-700 dark:hover:text-white"
                                >
                                    <FiTrash2 /> Delete Chat
                                </button>
                                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <FiUserX /> Block User
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-2xl max-w-xs break-words ${msg.sender === "me"
                                        ? "bg-blue-500 text-white rounded-br-none"
                                        : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                            Chat deleted. Start a new conversation.
                        </p>
                    )}
                </div>

                {/* Input Bar */}
                <div className="relative">
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mb-18 md:mb-0">
                        {/* Emoji Button */}
                        <button
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition relative"
                            onClick={() => setShowEmojiPicker((prev) => !prev)}
                        >
                            <FiSmile size={22} />
                        </button>

                        {/* File Attach */}
                        <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition">
                            <FiPaperclip size={22} />
                        </button>

                        {/* Input */}
                        <input
                            type="text"
                            placeholder="Message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />

                        {/* Send Button */}
                        <button
                            onClick={handleSend}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
                        >
                            <FiSend size={20} />
                        </button>
                    </div>

                    {/* Emoji Picker Modal */}
                    {showEmojiPicker && (
                        <div
                            ref={emojiRef}
                            className="absolute bottom-16 left-3 z-50 shadow-lg"
                        >
                            <EmojiPicker
                                theme="dark"
                                onEmojiClick={handleEmojiClick}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

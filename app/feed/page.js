// FeedPage.jsx
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import LikeButton from "@/components/Feed/LikeButton";
import Sidebar from "@/components/Feed/SideBar";
import { BiMessageSquareDetail } from "react-icons/bi";


const stories = [
    {
        id: 1,
        username: "vaibhav pari...",
        img: "https://randomuser.me/api/portraits/men/1.jpg",
        storyColor: "from-yellow-400 via-pink-500 to-purple-500",
    },
    {
        id: 2,
        username: "radhe_bha...",
        img: "https://randomuser.me/api/portraits/men/2.jpg",
        storyColor: "from-yellow-400 via-pink-500 to-purple-500",
    },
    {
        id: 3,
        username: "yash_dang...",
        img: "https://randomuser.me/api/portraits/men/3.jpg",
        storyColor: "from-yellow-400 via-pink-500 to-purple-500",
    },
    {
        id: 4,
        username: "rishichauh...",
        img: "https://randomuser.me/api/portraits/men/4.jpg",
        storyColor: "from-yellow-400 via-pink-500 to-purple-500",
    },
    {
        id: 5,
        username: "nirbhay_b...",
        img: "https://randomuser.me/api/portraits/men/5.jpg",
        storyColor: "from-yellow-400 via-pink-500 to-purple-500",
    },
    {
        id: 6,
        username: "malam_jig...",
        img: "https://randomuser.me/api/portraits/men/6.jpg",
        storyColor: "from-yellow-400 via-pink-500 to-purple-500",
    },
];

const posts = [
    {
        id: 1,
        username: "john_doe",
        userImg: "https://randomuser.me/api/portraits/men/32.jpg",
        postImg:
            "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80",
        caption: "Enjoying the beautiful sunset! 🌅",
        likes: 128,
        comments: [
            { id: 1, username: "jane_smith", text: "Wow, amazing shot!" },
            { id: 2, username: "user123", text: "Love this place." },
        ],
    },
    {
        id: 2,
        username: "jane_smith",
        userImg: "https://randomuser.me/api/portraits/women/44.jpg",
        postImg:
            "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
        caption: "Coffee time ☕️ #morningroutine",
        likes: 256,
        comments: [{ id: 1, username: "john_doe", text: "Need that coffee!" }],
    },
];

const suggestions = [
    {
        id: 1,
        username: "krishna._jigar",
        img: "https://randomuser.me/api/portraits/men/7.jpg",
        followedBy: "janak_meghnathi_07",
    },
    {
        id: 2,
        username: "b.jr_parmarr",
        img: "https://randomuser.me/api/portraits/men/8.jpg",
        followedBy: "mr_dix_savaliya",
    },
    {
        id: 3,
        username: "jin.joshi28",
        img: "https://randomuser.me/api/portraits/men/9.jpg",
        followedBy: "kaushal_joshi_111",
    },
    {
        id: 4,
        username: "username.kho.gaya.bhai",
        img: "https://randomuser.me/api/portraits/men/10.jpg",
        followedBy: "kartik_pankhaniya20",
    },
    {
        id: 5,
        username: "viki_pankhaniya",
        img: "https://randomuser.me/api/portraits/men/11.jpg",
        followedBy: "kartik_pankhaniya2",
    },
];

export default function FeedPage() {
    return (
        <div className="bg-black min-h-screen text-white">
            <div className="max-w-6xl mx-auto px-4 pt-6 flex gap-6">
                {/* Left Sidebar */}
                <Sidebar />

                {/* Main Feed + Stories */}
                <main className="flex-1 max-w-xl mx-auto">
                    {/* Stories */}
                    <div className="flex space-x-4 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-black py-2">
                        {stories.map((story) => (
                            <div key={story.id} className="flex flex-col items-center w-26">
                                <div
                                    className={`p-1 rounded-full bg-gradient-to-tr ${story.storyColor}`}
                                >
                                    <img
                                        src={story.img}
                                        alt={story.username}
                                        className="w-20 h-20 rounded-full border-1 border-black object-cover"
                                    />
                                </div>
                                <span className="text-xs truncate mt-1">{story.username}</span>
                            </div>
                        ))}
                    </div>

                    {/* Posts */}
                    {posts.map((post) => (
                        <div key={post.id} className="flex justify-center mb-8">
                            <article
                                className="bg-black border border-gray-800 rounded-lg shadow-md max-w-md w-full"
                            >
                                {/* Post header */}
                                <header className="flex items-center p-4">
                                    <img
                                        src={post.userImg}
                                        alt={post.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className="ml-3 font-semibold">{post.username}</span>
                                </header>

                                {/* Post image */}
                                <img
                                    src={post.postImg}
                                    alt="Post"
                                    className="w-full object-cover max-h-[400px]"
                                />

                                {/* Post actions */}
                                <div className="flex items-center space-x-4 px-4 py-3 text-white">
                                    <LikeButton />
                                    <FaRegComment className="cursor-pointer" />
                                    <FiSend className="cursor-pointer" />
                                </div>

                                {/* Likes count */}
                                <div className="px-4 font-semibold text-white">
                                    {post.likes.toLocaleString()} likes
                                </div>

                                {/* Caption */}
                                <div className="px-4 py-2">
                                    <span className="font-semibold mr-2">{post.username}</span>
                                    <span>{post.caption}</span>
                                </div>

                                {/* Comments */}
                                <div className="px-4 pb-4 space-y-1 text-gray-400 text-sm">
                                    {post.comments.map((c) => (
                                        <p key={c.id}>
                                            <span className="font-semibold mr-1">{c.username}</span>
                                            {c.text}
                                        </p>
                                    ))}
                                </div>
                            </article>
                        </div>
                    ))}
                    <aside className="hidden xl:flex flex-col w-80 text-gray-300 space-y-4 pt-4 sticky top-6 h-screen">
                        {/* Profile summary */}
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="https://randomuser.me/api/portraits/men/12.jpg"
                                    alt="vaibhhav87"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-white">vaibhhav87</p>
                                    <p className="text-xs uppercase tracking-wide">VAIBHAV</p>
                                </div>
                            </div>
                            <button className="text-blue-500 text-sm font-semibold">Switch</button>
                        </div>

                        {/* Suggestions */}
                        <div className="px-4">
                            <div className="flex justify-between items-center mb-2 text-gray-500 font-semibold">
                                <span>Suggested for you</span>
                                <button className="text-sm font-semibold hover:underline">See All</button>
                            </div>
                            <ul className="space-y-3">
                                {suggestions.map((s) => (
                                    <li key={s.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={s.img}
                                                alt={s.username}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-white">{s.username}</p>
                                                <p className="text-xs text-gray-500">Followed by {s.followedBy}</p>
                                            </div>
                                        </div>
                                        <button className="text-blue-500 font-semibold text-sm">Follow</button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Footer */}
                        <footer className="px-4 mt-auto text-xs text-gray-600 space-y-1">
                            <p>
                                About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified
                            </p>
                            <p>© 2025 INSTAGRAM FROM META</p>
                        </footer>
                    </aside>
                </main>

                <div className="fixed bottom-0 right-0 m-5 bg-gray-800 py-3 px-10 flex justify-center gap-2 items-center rounded-full">
                    <BiMessageSquareDetail className="text-2xl"></BiMessageSquareDetail>
                    <h1 className="text-[15px]">messages</h1>
                </div>

            </div>
        </div>
    );
}

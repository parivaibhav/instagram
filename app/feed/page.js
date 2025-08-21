"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaRegComment, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import LikeButton from "@/components/Feed/LikeButton";
import Sidebar from "@/components/Feed/SideBar";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoLogoInstagram } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { RiChatSmile2Line } from "react-icons/ri";
import { MdBookmarkBorder } from "react-icons/md";
import CommentForm from "@/components/Comments/CommentForm";
// import Comment from "@/components/Comments/Comment";

const stories = [
    { id: 1, username: "Vaibhhav87", img: "https://randomuser.me/api/portraits/men/1.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
    { id: 2, username: "radhe_bhai", img: "https://randomuser.me/api/portraits/men/2.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
    { id: 3, username: "yash_dang", img: "https://randomuser.me/api/portraits/men/3.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
    { id: 4, username: "rishichauh", img: "https://randomuser.me/api/portraits/men/4.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
    { id: 5, username: "nirbhay_b", img: "https://randomuser.me/api/portraits/men/5.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
    { id: 6, username: "malam_jig", img: "https://randomuser.me/api/portraits/men/6.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
    { id: 7, username: "arjun_k", img: "https://randomuser.me/api/portraits/men/7.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
    { id: 8, username: "sita_r", img: "https://randomuser.me/api/portraits/women/8.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
    { id: 9, username: "puneet_s", img: "https://randomuser.me/api/portraits/men/9.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
    { id: 10, username: "laila_m", img: "https://randomuser.me/api/portraits/women/10.jpg", storyColor: "from-yellow-400 via-pink-500 to-purple-500" },
];

const initialPosts = [
    {
        id: 1,
        username: "john_doe",
        userImg: "https://randomuser.me/api/portraits/men/32.jpg",
        postImg: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80",
        caption: "Enjoying the beautiful sunset! 🌅",
        likes: 128,
        liked: false,
        comments: [
            { id: 1, username: "jane_smith", text: "Wow, amazing shot!" },
            { id: 2, username: "user123", text: "Love this place." },
        ],
    },
    {
        id: 2,
        username: "jane_smith",
        userImg: "https://randomuser.me/api/portraits/women/44.jpg",
        postImg: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
        caption: "Coffee time ☕️ #morningroutine",
        likes: 256,
        liked: false,
        comments: [{ id: 1, username: "john_doe", text: "Need that coffee!" }],
    },
];

export default function FeedPage() {
    const router = useRouter();
    const storyRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const [posts, setPosts] = useState(initialPosts);
    const [animatingPost, setAnimatingPost] = useState(null); // for heart animation

    const handleScroll = () => {
        if (!storyRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = storyRef.current;
        setShowLeft(scrollLeft > 0);
        setShowRight(scrollLeft + clientWidth < scrollWidth);
    };

    const scrollStories = (direction) => {
        if (!storyRef.current) return;
        const scrollAmount = 200;
        storyRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        handleScroll();
    }, []);

    // Double tap handler
    const handleDoubleTap = (postId) => {
        setPosts((prev) =>
            prev.map((post) =>
                post.id === postId
                    ? { ...post, liked: true, likes: post.liked ? post.likes : post.likes + 1 }
                    : post
            )
        );
        setAnimatingPost(postId);
        setTimeout(() => setAnimatingPost(null), 800);
    };

    return (
        <div className="bg-black min-h-screen text-white">
            {/* Mobile top bar */}
            <div className="flex md:hidden fixed top-0 py-4 border-b w-full bg-black border-gray-800 z-50 justify-between">
                <IoLogoInstagram className="ms-3 text-2xl hover:text-[1.52rem] transition cursor-pointer" />
                <div className="inline-flex gap-x-4 px-3 text-xl">
                    <FaRegHeart className="cursor-pointer" />
                    <RiChatSmile2Line className="cursor-pointer" onClick={() => router.push("/chats")} />
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex gap-6 pt-20 md:pt-0">
                {/* Left Sidebar */}
                <Sidebar />

                {/* Main Feed */}
                <div className="flex-1 w-full max-w-xl md:ml-20">
                    <main>
                        {/* Stories */}
                        <div className="relative mb-6">
                            {showLeft && (
                                <button
                                    onClick={() => scrollStories("left")}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/60 text-black p-2 rounded-full z-10 hidden sm:block"
                                    aria-label="Scroll stories left"
                                >
                                    <FaChevronLeft />
                                </button>
                            )}

                            <div
                                ref={storyRef}
                                onScroll={handleScroll}
                                className="flex space-x-4 overflow-x-auto scrollbar-none py-2 scroll-smooth"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                                <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                                {/* My Story */}
                                <div className="flex flex-col items-center w-24">
                                    <div className="relative">
                                        <img
                                            src="images/pr.jpg"
                                            alt="Your story"
                                            className="w-20 h-20 rounded-full border border-black object-cover"
                                        />
                                        <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-black">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <span className="text-xs truncate mt-1 w-20 text-center">Your story</span>
                                </div>

                                {/* Other Stories */}
                                {stories.map((story) => (
                                    <div key={story.id} className="flex flex-col items-center w-24">
                                        <div
                                            className={`p-[2px] rounded-full bg-gradient-to-tr ${story.storyColor} flex items-center justify-center`}
                                        >
                                            <div className="bg-black rounded-full p-[2px]">
                                                <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
                                                    <img src={story.img} alt={story.username} className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs truncate mt-1 w-20 text-center">{story.username}</span>
                                    </div>
                                ))}
                            </div>

                            {showRight && (
                                <button
                                    onClick={() => scrollStories("right")}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/60 text-black p-2 rounded-full z-10 hidden sm:block"
                                    aria-label="Scroll stories right"
                                >
                                    <FaChevronRight />
                                </button>
                            )}
                        </div>

                        {/* Posts */}
                        <div className="mb-28 md:mb-0 px-0 md:px-10">
                            {posts.map((post) => (
                                <div key={post.id} className="mb-8 w-full">
                                    <article className="bg-black rounded-lg shadow-md w-full">
                                        {/* Post header */}
                                        <header className="flex items-center justify-between p-4">
                                            <div className="flex gap-1 items-center">
                                                <img src={post.userImg} alt={post.username} className="w-10 h-10 rounded-full object-cover" />
                                                <span className="ml-3 font-semibold">{post.username}</span>
                                            </div>
                                            <HiOutlineDotsVertical />
                                        </header>

                                        {/* Post image with double tap */}
                                        <div
                                            className="relative"
                                            onDoubleClick={() => handleDoubleTap(post.id)}
                                        >
                                            <img
                                                src={post.postImg}
                                                alt="Post"
                                                className="w-full object-cover max-h-[500px] sm:rounded-lg select-none"
                                            />
                                            {animatingPost === post.id && (
                                                <FaHeart
                                                    className="absolute inset-0 m-auto text-white/90 drop-shadow-lg"
                                                    size={120}
                                                    style={{
                                                        animation: "pop 0.8s ease forwards",
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Post actions */}
                                        <div className="flex items-center justify-between px-4 py-3 text-white text-xl">
                                            <div className="flex items-center space-x-4">
                                                <LikeButton liked={post.liked} />
                                                <FaRegComment className="cursor-pointer" />
                                                <FiSend className="cursor-pointer" />
                                            </div>
                                            <MdBookmarkBorder className="cursor-pointer text-[22px]" />
                                        </div>

                                        {/* Likes */}
                                        <div className="px-4 font-semibold text-sm">{post.likes} likes</div>

                                        {/* Caption */}
                                        <div className="px-4 py-2">
                                            <span className="font-semibold mr-2">{post.username}</span>
                                            <span>{post.caption}</span>
                                        </div>

                                        {/* Comments */}
                                        {/* <Comment /> */}
                                        <CommentForm />
                                    </article>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            {/* Heart animation keyframes */}
            <style>{`
        @keyframes pop {
          0% { transform: scale(0.2); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
        </div>
    );
}

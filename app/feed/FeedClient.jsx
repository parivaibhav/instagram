"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaRegComment, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoLogoInstagram } from "react-icons/io5";
import { RiChatSmile2Line } from "react-icons/ri";
import { MdBookmarkBorder } from "react-icons/md";

import Sidebar from "@/components/Feed/SideBar";
import CommentForm from "@/components/Comments/CommentForm";

export default function FeedPageClient() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [animatingPost, setAnimatingPost] = useState(null);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts?following=true");
      const data = await res.json();
      // Ensure we have liked property for each post
      const postsWithLiked = data.map((post) => ({
        ...post,
        liked: post.likes.includes(post.currentUserId), // backend must return currentUserId
      }));
      setPosts(postsWithLiked);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    setAnimatingPost(postId);

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          const liked = !post.liked;
          const likes = liked ? post.likes + 1 : post.likes - 1;
          return { ...post, liked, likes };
        }
        return post;
      })
    );

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();

      // Update the post with real backend data
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, likes: data.likes, liked: data.liked }
            : post
        )
      );
    } catch (err) {
      console.error("Like API Error:", err);
      fetchPosts(); // revert on error
    }

    setTimeout(() => setAnimatingPost(null), 800);
  };

  const addComment = async (postId, text) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });
      const newComment = await res.json();

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), newComment] }
            : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Mobile Top Bar */}
      <div className="flex md:hidden fixed top-0 py-4 border-b w-full bg-black border-gray-800 z-50 justify-between">
        <IoLogoInstagram className="ms-3 text-2xl cursor-pointer" />
        <div className="inline-flex gap-x-4 px-3 text-xl">
          <FaRegComment className="cursor-pointer" />
          <RiChatSmile2Line
            className="cursor-pointer"
            onClick={() => router.push("/chats")}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-6 pt-20 md:pt-0">
        <Sidebar />

        <div className="flex-1 w-full max-w-xl md:ml-20">
          <main>
            <div className="relative mb-6">{/* Stories UI */}</div>

            <div className="mb-28 md:mb-0 px-0 md:px-10">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="mb-8 w-full">
                    <article className="bg-black rounded-lg shadow-md w-full">
                      <header className="flex items-center justify-between p-4">
                        <div className="flex gap-1 items-center">
                          <img
                            src={post.author?.avatar || "/images/pr.jpg"}
                            alt={post.author?.username || "user"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="ml-3 font-semibold">
                            {post.author?.username || "user"}
                          </span>
                        </div>
                        <HiOutlineDotsVertical />
                      </header>

                      <div
                        className="relative"
                        onDoubleClick={() => handleLike(post._id)}
                      >
                        <img
                          src={post.imageUrl}
                          alt="Post"
                          className="w-full object-cover max-h-[500px] sm:rounded-lg select-none"
                        />
                        {animatingPost === post._id && (
                          <FaHeart
                            className="absolute inset-0 m-auto text-white/90 drop-shadow-lg"
                            size={120}
                            style={{ animation: "pop 0.8s ease forwards" }}
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between px-4 py-3 text-white text-xl">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => handleLike(post._id)}>
                            {post.liked ? (
                              <FaHeart className="text-red-500" />
                            ) : (
                              <FaRegHeart />
                            )}
                          </button>
                          <FaRegComment className="cursor-pointer" />
                          <FiSend className="cursor-pointer" />
                        </div>
                        <MdBookmarkBorder className="cursor-pointer text-[22px]" />
                      </div>

                      <div className="px-4 font-semibold text-sm">
                        {post.likes} likes
                      </div>
                      <div className="px-4 py-2">
                        <span className="font-semibold mr-2">
                          {post.author?.username || "user"}
                        </span>
                        <span>{post.caption}</span>
                      </div>

                      <CommentForm
                        comments={post.comments || []}
                        onAddComment={(text) => addComment(post._id, text)}
                      />
                    </article>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400">No posts yet</p>
              )}
            </div>
          </main>
        </div>
      </div>

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

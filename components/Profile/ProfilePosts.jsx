"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { RiChat3Line } from "react-icons/ri";

export default function ProfilePosts({ username }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        const res = await fetch(`/api/posts?username=${username}`, {
          cache: "no-store",
        });
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
  }, [username]);

  if (loading)
    return <p className="text-center mt-8 text-gray-500">Loading posts...</p>;
  if (!posts.length)
    return <p className="text-center mt-8 text-gray-500">No posts yet.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-1 md:gap-2">
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/post/${post._id}`}
          className="relative group"
        >
          <div className="w-full aspect-square overflow-hidden rounded-sm bg-gray-100">
            <Image
              src={post.imageUrl}
              alt={post.caption || "User post"}
              fill
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 100vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/25 bg-opacity-0 group-hover:bg-opacity-25 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition duration-300 group-hover:scale-110">
              <div className="flex items-center gap-1 text-white font-semibold">
                <AiOutlineHeart size={20} />
                <span>{post.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-white font-semibold">
                <RiChat3Line size={20} />
                <span>{post.comments?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-white font-semibold">
                <FiSend size={20} />
                <span>{post.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

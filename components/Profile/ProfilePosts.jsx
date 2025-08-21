"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePosts({ username }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts?username=${username}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-8">Loading posts...</div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center text-gray-500 mt-8">No posts yet.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/post/${post._id}`}
            className="relative group"
          >
            <div className="aspect-square relative w-full h-0 overflow-hidden">
              <Image
                src={post.imageUrl} // your post image field
                alt={post.caption || "User post"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(min-width: 768px) 33vw, 100vw"
                priority={false}
              />
            </div>

            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-semibold transition-opacity">
              {/* optional overlay: likes/comments */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

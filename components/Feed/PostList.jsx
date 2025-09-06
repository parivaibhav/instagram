"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PostList({ currentUserId, fetchUrl = "/api/posts" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(fetchUrl, { cache: "no-store" });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch posts");
        }

        const data = await res.json();

        // assume API already returns `likesCount` + `liked`
        const normalized = data.map((post) => ({
          ...post,
          likesCount:
            post.likesCount ??
            (Array.isArray(post.likes) ? post.likes.length : 0),
          liked: post.liked ?? false,
        }));

        setPosts(normalized);
      } catch (err) {
        console.error("Error fetching posts:", err.message);
        setError("Failed to load posts.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [fetchUrl, currentUserId]);

  const toggleLike = async (postId) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              liked: !post.liked,
              likesCount: post.liked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post
      )
    );

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to toggle like");

      const data = await res.json();
      // API now returns { likesCount, liked }
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, liked: data.liked, likesCount: data.likesCount }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-500">Loading posts...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!posts.length)
    return <p className="text-center mt-8 text-gray-500">No posts yet.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="relative group border rounded overflow-hidden"
        >
          <Link href={`/post/${post._id}`}>
            <div className="aspect-square relative w-full h-0 overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.caption || "User post"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
          </Link>

          <button
            onClick={() => toggleLike(post._id)}
            className={`absolute bottom-2 right-2 px-2 py-1 rounded ${
              post.liked ? "bg-red-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {post.liked ? "Liked" : "Like"} ({post.likesCount})
          </button>
        </div>
      ))}
    </div>
  );
}

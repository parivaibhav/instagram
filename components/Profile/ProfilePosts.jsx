"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePosts({ posts }) {
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
                src={post.imageUrl} // adjust to your post image field
                alt={post.caption || "User post"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(min-width: 768px) 33vw, 100vw"
                priority={false}
              />
            </div>

            {/* Optional overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-semibold transition-opacity">
              {/* You can add icons like likes/comments count here */}
              {/* Example: ❤️ {post.likesCount}  💬 {post.commentsCount} */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LikeButton from "./LikeButton";
import CommentList from "./CommentList";

export default function Post({ post }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="bg-white border border-gray-300 rounded-md max-w-xl mx-auto my-6 shadow-sm">
      {/* Post header: User info */}
      <header className="flex items-center p-4">
        <Link
          href={`/profile/${post.user.username}`}
          className="flex items-center space-x-3"
        >
          {post.user.avatar ? (
            <Image
              src={post.user.avatar}
              alt={`${post.user.username}'s avatar`}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold uppercase">
              {post.user.username[0]}
            </div>
          )}
          <span className="font-semibold text-sm">{post.user.username}</span>
        </Link>
      </header>

      {/* Post image */}
      <div className="w-full">
        <Image
          src={post.imageUrl}
          alt={post.caption || "Post image"}
          width={800}
          height={800}
          className="w-full object-cover"
          priority={true}
        />
      </div>

      {/* Post actions: Like button */}
      <div className="px-4 py-2 flex items-center space-x-4">
        <LikeButton
          initialLiked={post.isLikedByCurrentUser}
          initialCount={post.likesCount}
          onToggle={(liked) => {
            // Handle like toggle API call here
          }}
        />
      </div>

      {/* Caption */}
      <div className="px-4 py-1 text-sm">
        <Link
          href={`/profile/${post.user.username}`}
          className="font-semibold mr-2 hover:underline"
        >
          {post.user.username}
        </Link>
        <span>{post.caption}</span>
      </div>

      {/* Comments preview */}
      <div className="px-4 py-2">
        {post.comments && post.comments.length > 0 && !showComments && (
          <button
            className="text-sm text-gray-500 hover:underline"
            onClick={() => setShowComments(true)}
          >
            View all {post.comments.length} comments
          </button>
        )}

        {showComments && <CommentList comments={post.comments} />}
      </div>

      {/* Timestamp */}
      <div className="px-4 py-2 text-xs text-gray-400">
        {post.createdAt
          ? new Date(post.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : ""}
      </div>
    </article>
  );
}

"use client";
import React from "react";
import Post from "./Post";

export default function PostList({ posts }) {
  if (!posts || posts.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No posts to show.</p>;
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto my-6">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

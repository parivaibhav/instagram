"use client";
import React, { useState } from "react";

export default function FollowButton({
  isFollowing: initialIsFollowing,
  userId,
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  async function handleFollowToggle() {
    setLoading(true);
    try {
      // Replace with your API call to follow/unfollow user by userId
      const res = await fetch(`/api/follow/${userId}`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      if (!res.ok) throw new Error("Failed to update follow status");

      setIsFollowing(!isFollowing);
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-4 py-1 rounded text-sm font-semibold transition 
        ${
          isFollowing
            ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}

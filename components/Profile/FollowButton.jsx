"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export default function FollowButton({ userId }) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hovering, setHovering] = useState(false);

  // ✅ Fetch initial follow status
  useEffect(() => {
    if (!userId || !session?.user) {
      setLoading(false);
      return;
    }

    async function fetchStatus() {
      try {
        const res = await fetch(`/api/follow/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (err) {
        console.error("Failed to load follow status:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [userId, session?.user]);

  async function handleFollowToggle() {
    if (!session?.user) {
      return signIn(); // redirect guest to login
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/follow/${userId}`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      if (!res.ok) throw new Error("Failed to update follow status");

      const data = await res.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollowToggle}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      disabled={loading}
      className={`px-4 py-1.5 text-sm font-semibold rounded-md border transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          !isFollowing
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : hovering
            ? "bg-red-500 text-white border-red-500"
            : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
        }`}
    >
      {loading ? (
        <span className="animate-pulse">Loading...</span>
      ) : !isFollowing ? (
        "Follow"
      ) : hovering ? (
        "Unfollow"
      ) : (
        "Following"
      )}
    </button>
  );
}

"use client";
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function LikeButton({
  initialLiked = false,
  initialCount = 0,
  onToggle,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    if (liked) {
      setCount(count - 1);
      setLiked(false);
      if (onToggle) onToggle(false);
    } else {
      setCount(count + 1);
      setLiked(true);
      if (onToggle) onToggle(true);
    }
  };

  return (
    <button
      aria-label={liked ? "Unlike post" : "Like post"}
      onClick={handleClick}
      className="flex items-center space-x-1 text-white transition"
      type="button"
    >
      {liked ? (
        <FaHeart className="text-red-500" size={22} />
      ) : (
        <FaRegHeart size={22} />
      )}
      <span className="select-none text-sm">{count}</span>
    </button>
  );
}

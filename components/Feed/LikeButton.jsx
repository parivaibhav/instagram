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
      className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition"
      type="button"
    >
      {liked ? (
        <FaHeart className="text-red-600" size={20} />
      ) : (
        <FaRegHeart size={20} />
      )}
      <span className="select-none text-sm">{count}</span>
    </button>
  );
}

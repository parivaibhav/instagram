"use client";

import React, { useState } from "react";
import { LuSend } from "react-icons/lu";

export default function CommentForm({ comments = [], onAddComment }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      await onAddComment(text.trim()); // call parent handler
      setText("");
    } catch (err) {
      console.error(err);
      setError("Failed to post comment. Please try again.");
    }
  };

  return (
    <div className="border-t border-gray-800 px-4 py-2">
      {/* Existing comments preview (show last 2) */}
      {comments.length > 0 && (
        <div className="mb-2 space-y-1 text-sm text-gray-300">
          {comments.slice(-2).map((c, i) => (
            <p key={c._id || `${i}-${c.text}`}>
              <span className="font-semibold">
                {c.author?.username || "user"}{" "}
              </span>
              {c.text}
            </p>
          ))}
          {comments.length > 2 && (
            <button className="text-xs text-gray-500">
              View all {comments.length} comments
            </button>
          )}
        </div>
      )}

      {/* Comment input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-2 w-full"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow bg-transparent text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
          maxLength={200}
        />
        {text.trim() && (
          <button
            type="submit"
            className="text-sm font-semibold text-white transition"
          >
            <LuSend />
          </button>
        )}
      </form>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

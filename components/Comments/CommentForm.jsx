"use client";
import React, { useState } from "react";

export default function CommentForm({ onSubmit }) {
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
      await onSubmit(text.trim());
      setText("");
    } catch (err) {
      setError("Failed to post comment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-grow px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        maxLength={200}
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className={`text-sm font-semibold text-blue-500 ${
          !text.trim() ? "opacity-50 cursor-not-allowed" : "hover:text-blue-700"
        }`}
      >
        Post
      </button>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </form>
  );
}

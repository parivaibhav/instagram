"use client";
import React, { useState } from "react";
import { LuSend } from "react-icons/lu";

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
    <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-2 w-full"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none"
          maxLength={200}
        />
        {text.trim() && (
          <button
            type="submit"
            className="text-sm font-semibold text-black dark:text-white transition"
          >
            <LuSend />
          </button>
        )}
      </form>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

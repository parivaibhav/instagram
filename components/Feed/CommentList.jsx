"use client";
import React from "react";
import Image from "next/image";

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="text-gray-500 text-sm mt-2">No comments yet.</p>;
  }

  return (
    <ul className="space-y-3 mt-2">
      {comments.map((comment) => (
        <li key={comment._id} className="flex space-x-3">
          {/* User Avatar */}
          {comment.user?.avatar ? (
            <Image
              src={comment.user.avatar}
              alt={`${comment.user.username}'s avatar`}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold uppercase">
              {comment.user?.username?.[0] || "U"}
            </div>
          )}

          {/* Comment Content */}
          <div>
            <p className="text-sm">
              <span className="font-semibold mr-1">
                {comment.user?.username || "Unknown"}
              </span>
              {comment.text}
            </p>

            {/* Nested replies (optional) */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6 mt-2 border-l border-gray-200 pl-4">
                <CommentList comments={comment.replies} />
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

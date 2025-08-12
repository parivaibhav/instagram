"use client";
import React from "react";
import Image from "next/image";



export default function Comment({ comment }) {
    
  return (
    <div className="flex space-x-3 items-start">
      {/* User avatar */}
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

      {/* Comment content */}
      <div>
        <p className="text-sm">
          <span className="font-semibold mr-1">
            {comment.user?.username || "Unknown"}
          </span>
          {comment.text}
        </p>
      </div>
    </div>
  );
}

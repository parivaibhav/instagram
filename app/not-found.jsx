// app/not-found.jsx
"use client";

import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 text-center">
      {/* Animated Broken Camera */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-32 h-32 mb-6 text-gray-500 animate-wiggle"
        fill="none"
        viewBox="0 0 64 64"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M32 12c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 0v6m0 10v10m-6-6h12"
        />
        <line x1="16" y1="16" x2="48" y2="48" stroke="red" strokeWidth={3} />
      </svg>

      <h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
      <p className="text-xl md:text-2xl mb-2 font-semibold">
        Oops! This page isn’t available.
      </p>
      <p className="text-gray-400 mb-6 max-w-sm">
        The link you followed may be broken, or the page may have been removed.
        Try going back to the homepage.
      </p>
      <Link
        href="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition"
      >
        Go back Home
      </Link>
    </div>
  );
}

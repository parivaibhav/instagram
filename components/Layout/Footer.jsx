"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm space-y-4 md:space-y-0">
        {/* Left links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2">
          <Link href="#" className="hover:underline">
            About
          </Link>
          <Link href="#" className="hover:underline">
            Help
          </Link>
          <Link href="#" className="hover:underline">
            Press
          </Link>
          <Link href="#" className="hover:underline">
            API
          </Link>
          <Link href="#" className="hover:underline">
            Jobs
          </Link>
          <Link href="#" className="hover:underline">
            Privacy
          </Link>
          <Link href="#" className="hover:underline">
            Terms
          </Link>
          <Link href="#" className="hover:underline">
            Locations
          </Link>
          <Link href="#" className="hover:underline">
            Language
          </Link>
        </div>

        {/* Right copyright */}
        <div className="text-center md:text-right">
          © {new Date().getFullYear()} Instagram by Meta
        </div>
      </div>
    </footer>
  );
}

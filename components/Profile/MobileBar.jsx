"use client";

import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function ProfileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex md:hidden items-center justify-between p-4 border-b border-gray-800">
      {/* Profile title */}
      <h1 className="text-xl font-bold">Profile</h1>

      {/* Mobile menu button (hidden on md+) */}
      <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
        {open ? <FiX /> : <FiMenu />}
      </button>

      {/* Example mobile dropdown menu */}
      {open && (
        <div className="absolute top-14 right-4 bg-black shadow-lg rounded-lg p-4 w-48 md:hidden z-30 border border-gray-500">
          <ul className="space-y-3 text-gray-200 ">
            <li className="hover:text-black cursor-pointer">Settings</li>
            <li className="text-red-500 cursor-pointer">Logout</li>
          </ul>
        </div>
      )}
    </header>
  );
}

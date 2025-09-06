// /components/menus/MoreMenu.jsx
"use client";

import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { RiLogoutCircleRLine } from "react-icons/ri";

export default function MoreMenu({ isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end md:items-center z-50">
      <div className="bg-black border border-gray-800 rounded-t-2xl md:rounded-xl w-full md:w-80 p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">More Options</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white">
            <FiSettings size={20} /> Settings
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-400"
          >
            <RiLogoutCircleRLine size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

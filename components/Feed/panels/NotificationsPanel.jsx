// /components/panels/SearchPanel.jsx
"use client";

import React, { forwardRef } from "react";
import { AiOutlineClose } from "react-icons/ai";


const SearchPanel = forwardRef(({ onClose }, ref) => {
  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-full md:left-18 md:w-1/4 h-screen bg-black border-r border-gray-800 text-white z-40 p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{searchPanelData.title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <AiOutlineClose />
        </button>
      </div>
      <input
        type="text"
        placeholder={searchPanelData.placeholder}
        className="w-full bg-gray-800 rounded-lg p-2 text-white outline-none"
      />
      <p className="text-gray-400 text-center mt-40 text-sm">
        {searchPanelData.emptyMessage}
      </p>
    </div>
  );
});

export default SearchPanel;

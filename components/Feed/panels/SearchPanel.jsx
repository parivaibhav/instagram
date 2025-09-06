"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchPanel = forwardRef(({ onClose }, ref) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search failed", err);
      }
      setLoading(false);
    };

    const delayDebounce = setTimeout(fetchUsers, 400); // debounce search
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-full md:left-18 md:w-1/4 h-screen bg-black border-r border-gray-800 text-white z-40 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Search</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <AiOutlineClose />
        </button>
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="w-full bg-gray-800 rounded-lg p-2 text-white outline-none"
      />

      {/* Results */}
      <div className="mt-6">
        {loading ? (
          <p className="text-gray-400 text-sm text-center">Searching...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-400 text-center mt-40 text-sm">
            No recent searches.
          </p>
        ) : (
          <ul className="space-y-3">
            {results.map((user) => (
              <li
                key={user._id}
                onClick={() => {
                  router.push(`/${user.username}`);
                  onClose();
                }}
                className="flex items-start gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded-lg"
              >
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.fullName}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

SearchPanel.displayName = "SearchPanel";
export default SearchPanel;

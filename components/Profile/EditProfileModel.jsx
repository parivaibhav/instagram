"use client";

import React, { useState, useRef } from "react";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState(user.username || "");
  const [name, setName] = useState(user.name || "");
  const [website, setWebsite] = useState(user.website || "");
  const [bio, setBio] = useState(user.bio || "");
  const [privateAccount, setPrivateAccount] = useState(
    user.privateAccount || false
  );
  const [profilePic, setProfilePic] = useState(user.profilePic || "");
  const fileInputRef = useRef(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      username,
      name,
      website,
      bio,
      privateAccount,
      profilePic,
    };
    onSave(updatedUser);
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Modal Container */}
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-black bg-opacity-95 border border-gray-500 rounded-xl max-w-sm w-full p-5
            shadow-[0_4px_30px_rgba(0,0,0,0.7)] ring-1 ring-white/10
            flex flex-col space-y-5 text-white
            transition-transform duration-300 ease-in-out
            hover:scale-[1.02]"
        >
          
      

          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-2">
            <div
              className="w-15 h-15 rounded-full overflow-hidden border-2 border-white
                         transition cursor-pointer shadow-lg
                  "
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={profilePic}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full"
                draggable={false}
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-sm font-medium text-blue-400 hover:text-blue-500  cursor-pointer select-none"
            >
              Change Profile Photo
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleProfilePicChange}
            />
          </div>

          {/* Input Fields */}
          <div className="flex flex-col space-y-4">
            {/* Username */}
            <label className="block">
              <span className="text-sm font-semibold mb-1 block">Username</span>
              <input
                id="username"
                type="text"
                className="w-full rounded-md bg-black px-3 py-1.5 text-white border border-gray-400
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
                spellCheck={false}
              />
            </label>

            {/* Name */}
            <label className="block">
              <span className="text-sm font-semibold mb-1 block">Name</span>
              <input
                id="name"
                type="text"
                className="w-full rounded-md bg-bg-black px-3 py-1.5 text-white  border border-gray-400
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </label>

            {/* Website */}
            <label className="block">
              <span className="text-sm font-semibold mb-1 block">Website</span>
              <input
                id="website"
                type="url"
                placeholder="https://example.com"
                className="w-full rounded-md bg-bg-black px-3 py-1.5 text-white  border border-gray-400
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </label>

            {/* Bio */}
            <label className="block">
              <span className="text-sm font-semibold mb-1 block">Bio</span>
              <textarea
                id="bio"
                rows={2}
                maxLength={150}
                className="w-full resize-none rounded-md bg-bg-black px-3 py-1.5 text-white  border border-gray-400
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                           transition"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                spellCheck={false}
              />
              <p className="text-xs text-gray-400 mt-1 select-none">
                {bio.length}/150 characters
              </p>
            </label>

            {/* Private Account Toggle */}
            <div className="flex items-center space-x-3 select-none">
              <input
                id="private"
                type="checkbox"
                checked={privateAccount}
                onChange={(e) => setPrivateAccount(e.target.checked)}
                className="w-5 h-5 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400"
              />
              <label
                htmlFor="private"
                className="text-sm font-medium cursor-pointer"
              >
                Private Account
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-5 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md border border-gray-600
                         text-gray-300 hover:bg-gray-800 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700
                         transition font-semibold shadow-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

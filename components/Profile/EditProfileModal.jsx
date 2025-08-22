"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(
    user?.avatar || "/images/default-avatar.png"
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file)); // preview
      setAvatarFile(file); // mark as changed
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      let avatarData = null;
      if (avatarFile) {
        avatarData = await toBase64(avatarFile); // convert to base64
      }

      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bio,
          avatarFile: avatarData, // only send if changed
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      onUpdate?.(data.user); // update parent
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-xl w-full max-w-lg relative shadow-xl transition-colors mx-4 md:mx-0">
        {/* Header */}
        <div className="flex justify-between items-center border-b dark:border-neutral-700 px-4 py-3">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border dark:border-neutral-700">
              <Image
                src={avatar}
                alt="Profile"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <label className="text-blue-500 text-sm cursor-pointer">
              Change profile photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border dark:border-neutral-700 w-full p-2 rounded-md bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring focus:ring-gray-300 dark:focus:ring-neutral-600"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Write something about yourself"
              className="border dark:border-neutral-700 w-full p-2 rounded-md bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring focus:ring-gray-300 dark:focus:ring-neutral-600 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t dark:border-neutral-700 px-4 py-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mr-2"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-600 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

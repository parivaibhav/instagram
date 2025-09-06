"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function CreatePostModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Close modal on outside click or ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // File selection & validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("video")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          alert("Video must be 30 seconds or less.");
          return;
        }
        setFileType("video");
        setSelectedFile(URL.createObjectURL(file));
      };
      video.src = URL.createObjectURL(file);
    } else if (file.type.startsWith("image")) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2 MB.");
        return;
      }
      setFileType("image");
      setSelectedFile(URL.createObjectURL(file));
    } else {
      alert("Only images or videos are allowed.");
    }
  };

  // Convert file to Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  // Submit post
  const handlePostSubmit = async () => {
    if (!selectedFile || !session) {
      alert("You must be logged in and select a file.");
      return;
    }
    setIsUploading(true);

    try {
      // Convert file to Base64
      const response = await fetch(selectedFile);
      const blob = await response.blob();
      const file = new File([blob], "upload", { type: blob.type });
      const base64 = await fileToBase64(file);

      // Send to backend API
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, caption }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Post saved in DB:", data.post);
        onClose();
        setSelectedFile(null);
        setCaption("");
        setFileType(null);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-neutral-900 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700">
          <button
            className="text-blue-500 font-semibold"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </button>
          <h2 className="font-semibold">
            {selectedFile ? "New Post" : "Create new post"}
          </h2>
          {selectedFile ? (
            <button
              onClick={handlePostSubmit}
              disabled={isUploading}
              className={`text-white font-semibold px-4 py-1 rounded-xl ${
                isUploading ? "bg-gray-600" : "bg-blue-500"
              }`}
            >
              {isUploading ? "Uploading..." : "Post"}
            </button>
          ) : (
            <span className="text-gray-400">Share</span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          {!selectedFile ? (
            <label className="cursor-pointer flex flex-col items-center text-gray-400 w-full h-80 border border-dashed border-gray-600 rounded-lg hover:bg-neutral-800 transition justify-center">
              <span className="mb-2">Drag photos and videos here</span>
              <span className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm">
                Select from computer
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="flex-1 relative">
                {fileType === "image" ? (
                  <img
                    src={selectedFile}
                    alt="Preview"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={selectedFile}
                    controls
                    className="w-full h-96 rounded-lg"
                  />
                )}
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="flex-1 bg-neutral-800 rounded-lg p-3 outline-none text-white resize-none text-sm"
                rows={5}
                disabled={isUploading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

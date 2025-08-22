"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FiSearch, FiCompass, FiMoon } from "react-icons/fi";
import { GoHomeFill } from "react-icons/go";
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import { RiChatSmile2Line } from "react-icons/ri";
import {
  IoLogoInstagram,
  IoSettingsOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { FaRegHeart, FaBars } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { LiaBoxesSolid } from "react-icons/lia";
import { MdOutlineReportProblem } from "react-icons/md";
import { RiThreadsLine } from "react-icons/ri";
import { BiBookmark } from "react-icons/bi";
import { LuActivity } from "react-icons/lu";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const menuItems = [
  { id: 1, label: "Home", icon: GoHomeFill, action: "home" },
  { id: 2, label: "Search", icon: FiSearch, action: "search" },
  { id: 3, label: "Explore", icon: FiCompass, action: "explore" },
  { id: 4, label: "Reels", icon: SiGoogledisplayandvideo360 },
  { id: 5, label: "Messages", icon: RiChatSmile2Line, action: "chats" },
  { id: 6, label: "Notifications", icon: FaRegHeart, action: "notifications" },
  { id: 7, label: "Create", icon: CgAddR, action: "create" },
  { id: 8, label: "Profile", icon: "profile-image", action: "profile" },
  { id: 9, label: "Menu", icon: FaBars, action: "more" },
  { id: 10, label: "More", icon: LiaBoxesSolid },
];

const mobileMenuIds = [1, 2, 7, 4, 8];

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activePanel, setActivePanel] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [caption, setCaption] = useState("");

  const moreMenuRef = useRef(null);
  const createPostRef = useRef(null);
  const searchPanelRef = useRef(null);
  const notificationsPanelRef = useRef(null);

  const handleMenuClick = (item) => {
    switch (item.action) {
      case "home":
        router.push("/feed");
        break;
      case "explore":
        router.push("/explore");
        break;
      case "profile":
        if (!session) return router.push("/auth/login");
        router.push(`/${session.user.name || session.user.email}`);
        break;
      case "chats":
        router.push("/chats");
        break;
      case "more":
        setShowMoreMenu((prev) => !prev);
        break;
      case "create":
        setShowCreatePost(true);
        break;
      case "search":
      case "notifications":
        setActivePanel((prev) => (prev === item.action ? null : item.action));
        break;
      default:
        break;
    }
  };

  const isAnyModalOpen =
    showCreatePost ||
    showMoreMenu ||
    activePanel === "search" ||
    activePanel === "notifications";
  useLockBodyScroll(isAnyModalOpen);

  // Close More Menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target))
        setShowMoreMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close Create Post Modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (createPostRef.current && !createPostRef.current.contains(e.target))
        setShowCreatePost(false);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowCreatePost(false);
    };
    if (showCreatePost) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showCreatePost]);

  // Close Search & Notifications on outside click (desktop)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(e.target) &&
        activePanel === "search"
      ) {
        setActivePanel(null);
      }
      if (
        notificationsPanelRef.current &&
        !notificationsPanelRef.current.contains(e.target) &&
        activePanel === "notifications"
      ) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePanel]);

  // Reel image validation
  const isValidReelImage = (file, callback) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = img.width / img.height;
      const valid = Math.abs(ratio - 9 / 16) < 0.05;
      callback(valid);
    };
  };

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
      isValidReelImage(file, (valid) => {
        if (!valid) {
          alert("Image must be in 9:16 ratio (vertical).");
          return;
        }
        setFileType("image");
        setSelectedFile(URL.createObjectURL(file));
      });
    } else {
      alert("Only images or videos are allowed.");
    }
  };

  const handlePostSubmit = () => {
    console.log("Caption:", caption, "File:", selectedFile, "Type:", fileType);
    setShowCreatePost(false);
    setSelectedFile(null);
    setCaption("");
    setFileType(null);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-black items-center fixed top-0 left-0 h-screen w-18 border-r border-gray-900 shadow-md z-50">
        <IoLogoInstagram className="mt-9 mb-8 text-2xl hover:text-[1.52rem] transition cursor-pointer" />
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex flex-col items-center justify-center p-4 mx-3 transition-colors rounded-xl focus:outline-none ${
              activePanel === item.action
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
            aria-label={item.label}
            title={item.label}
            onClick={() => handleMenuClick(item)}
          >
            {item.icon === "profile-image" ? (
              session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className={`w-7 h-7 rounded-full object-cover border transition duration-200 ${
                    activePanel === "profile"
                      ? "border-blue-500"
                      : "border-gray-500 hover:border-gray-400"
                  }`}
                />
              ) : (
                <RxAvatar size={26} className="text-gray-300" />
              )
            ) : (
              React.createElement(item.icon, { size: 26 })
            )}
          </button>
        ))}

        {/* More Menu */}
        {showMoreMenu && (
          <div
            ref={moreMenuRef}
            className="absolute bottom-16 left-20 w-64 bg-neutral-900 text-white rounded-2xl shadow-lg border border-gray-800 p-2"
          >
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg w-full">
              <IoSettingsOutline size={20} /> Settings
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg w-full">
              <LuActivity size={20} /> Your activity
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg w-full">
              <BiBookmark size={20} /> Saved
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg w-full">
              <FiMoon size={20} /> Switch appearance
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg w-full">
              <MdOutlineReportProblem size={20} /> Report a problem
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg w-full">
              <RiThreadsLine size={20} /> Threads
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg w-full text-red-400"
            >
              <IoLogOutOutline size={20} /> Log out
            </button>
          </div>
        )}
      </aside>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div
            ref={createPostRef}
            className="bg-neutral-900 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700">
              <button
                className="text-blue-500 font-semibold"
                onClick={() => setShowCreatePost(false)}
              >
                Cancel
              </button>
              <h2 className="font-semibold">
                {selectedFile ? "New Post" : "Create new post"}
              </h2>
              {selectedFile ? (
                <button
                  onClick={handlePostSubmit}
                  className="text-white font-semibold bg-gray-500 px-4 py-1 rounded-xl"
                >
                  Post
                </button>
              ) : (
                <span className="text-gray-400">Share</span>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col items-center justify-center p-6">
              {!selectedFile ? (
                <div className="w-full h-80 border border-dashed border-gray-600 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-neutral-800 transition">
                  <label className="cursor-pointer flex flex-col items-center text-gray-400">
                    <svg
                      className="w-14 h-14 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span className="text-base">
                      Drag photos and videos here
                    </span>
                    <span className="mt-2 px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm">
                      Select from computer
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
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
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1 rounded"
                    >
                      Change
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      className="w-full flex-1 bg-neutral-800 rounded-lg p-3 outline-none text-white resize-none text-sm"
                      rows={5}
                    />
                    <p className="text-gray-500 text-xs mt-2">
                      Add location, tag people, etc. (coming soon)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search Panel */}
      {activePanel === "search" && (
        <div
          ref={searchPanelRef}
          className={`fixed top-0 ${"left-0 w-full md:left-18 md:w-1/4"} h-screen bg-black border-r border-gray-800 text-white z-40 p-6`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Search</h2>
            <button
              onClick={() => setActivePanel(null)}
              className="text-gray-400 hover:text-white"
            >
              <AiOutlineClose />
            </button>
          </div>
          <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 mb-4">
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none flex-1 text-white"
            />
          </div>
          <h3 className="text-gray-400 text-sm mb-2">Recent</h3>
          <p className="text-gray-400 text-center mt-44 text-sm">
            No recent searches.
          </p>
        </div>
      )}

      {/* Notifications Panel */}
      {activePanel === "notifications" && (
        <div
          ref={notificationsPanelRef}
          className="hidden md:block fixed top-0 left-18 h-screen w-1/4 bg-black border-r border-gray-800 text-white z-40 p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          <p className="text-gray-400">No new notifications.</p>
        </div>
      )}

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 bg-black py-4 left-0 right-0 flex md:hidden justify-around border-t border-gray-800 shadow-inner z-50">
        {menuItems
          .filter((item) => mobileMenuIds.includes(item.id))
          .map((item) => (
            <button
              key={item.id}
              className="flex flex-col items-center justify-center p-2 text-sm transition-colors focus:outline-none"
              aria-label={item.label}
              title={item.label}
              onClick={() => handleMenuClick(item)}
            >
              {item.icon === "profile-image" ? (
                session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover border border-gray-500 hover:border-gray-400 transition duration-200"
                  />
                ) : (
                  <RxAvatar size={20} />
                )
              ) : (
                React.createElement(item.icon, { size: 20 })
              )}
            </button>
          ))}
      </nav>
    </>
  );
}

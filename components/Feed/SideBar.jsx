"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { GoHomeFill } from "react-icons/go";
import { FiSearch, FiCompass } from "react-icons/fi";
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import { RiChatSmile2Line } from "react-icons/ri";
import { IoLogoInstagram } from "react-icons/io5";
import { FaRegHeart, FaBars } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { RxAvatar } from "react-icons/rx";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

// Extracted components
import MoreMenu from "@/components/Feed/MoreMenu";
import CreatePostModal from "./models/CreatePostModal";
import SearchPanel from "./panels/SearchPanel";


const menuItems = [
  { id: 1, label: "Home", icon: GoHomeFill, action: "home" },
  { id: 2, label: "Search", icon: FiSearch, action: "search" },
  { id: 3, label: "Explore", icon: FiCompass, action: "explore" },
  { id: 4, label: "Reels", icon: SiGoogledisplayandvideo360, action: "reels" },
  { id: 5, label: "Messages", icon: RiChatSmile2Line, action: "chats" },
  { id: 6, label: "Notifications", icon: FaRegHeart, action: "notifications" },
  { id: 7, label: "Create", icon: CgAddR, action: "create" },
  { id: 8, label: "Profile", icon: "profile-image", action: "profile" },
  { id: 9, label: "Menu", icon: FaBars, action: "more" },
];

const mobileMenuIds = [1, 2, 7, 4, 8];

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activePanel, setActivePanel] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const moreMenuRef = useRef(null);
  const searchPanelRef = useRef(null);

  // Lock scroll if any modal open
  useLockBodyScroll(showCreatePost || showMoreMenu || activePanel === "search");

  const handleMenuClick = (item) => {
    switch (item.action) {
      case "home":
        router.push("/");
        break;
      case "explore":
        router.push("/explore");
        break;
      case "profile":
        if (!session) return router.push("/auth/login");
        router.push(`/${session.user.name}`);
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
        setActivePanel((prev) => (prev === "search" ? null : "search"));
        break;
      default:
        break;
    }
  };

  // Close More Menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close Search Panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchPanelRef.current &&
        !searchPanelRef.current.contains(e.target) &&
        activePanel === "search"
      ) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePanel]);

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
              <RxAvatar
                size={26}
                className={`${
                  activePanel === "profile"
                    ? "text-blue-400"
                    : "text-gray-300 hover:text-white"
                }`}
              />
            ) : (
              React.createElement(item.icon, { size: 26 })
            )}
          </button>
        ))}

        {/* More Menu */}
        {showMoreMenu && (
          <MoreMenu
            isOpen={showMoreMenu}
            onClose={() => setShowMoreMenu(false)}
            onLogout={() => signOut({ callbackUrl: "/auth/login" })}
          />
        )}
      </aside>

      {/* Modals & Panels */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
      {activePanel === "search" && (
        <SearchPanel
          ref={searchPanelRef}
          onClose={() => setActivePanel(null)}
        />
      )}

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 bg-black py-4 left-0 right-0 flex md:hidden justify-around border-t border-gray-800 shadow-inner z-50">
        {menuItems
          .filter((item) => mobileMenuIds.includes(item.id))
          .map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center p-2 text-sm ${
                activePanel === item.action
                  ? "text-blue-400"
                  : "text-gray-300 hover:text-white"
              }`}
              aria-label={item.label}
              onClick={() => handleMenuClick(item)}
            >
              {item.icon === "profile-image" ? (
                <RxAvatar size={20} />
              ) : (
                React.createElement(item.icon, { size: 20 })
              )}
            </button>
          ))}
      </nav>
    </>
  );
}

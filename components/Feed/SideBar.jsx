// Sidebar.jsx
import React from "react";
import { FiHome, FiSearch, FiCompass, FiBell, FiUser } from "react-icons/fi";
import { GoHomeFill } from "react-icons/go";
import { SiGoogledisplayandvideo360 } from "react-icons/si";
import { RiChatSmile2Line } from "react-icons/ri";
import { IoLogoInstagram } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { LiaBoxesSolid } from "react-icons/lia";
import { CgAddR } from "react-icons/cg";


import Image from "next/image";

const menuItems = [
  { id: 1, label: "Home", icon: <GoHomeFill size={26}  /> },
  { id: 2, label: "Search", icon: <FiSearch size={26} /> },
  { id: 3, label: "Explore", icon: <FiCompass size={26} /> },
  { id: 4, label: "Search", icon: <SiGoogledisplayandvideo360 size={24} /> },
  { id: 5, label: "Notifications", icon: <RiChatSmile2Line size={26} /> },
  { id: 6, label: "Notifications", icon: <FaRegHeart size={24} /> },
  { id: 7, label: "Profile", icon: <CgAddR size={26} /> },
  { id: 8, label: "Profile", icon: <CgProfile size={26} /> },
  { id: 9, label: "Profile", icon: <FaBars size={26} /> },
  { id: 10, label: "Profile", icon: <LiaBoxesSolid size={26} /> },
];

export default function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col bg-black items-center fixed top-0 left-0 h-screen w-18 border-r border-gray-800 shadow-md z-50 ">
        <IoLogoInstagram className="mt-9 mb-8 text-2xl" />
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center justify-center p-4 transition-colors focus:outline-none hover:bg-gray-800 mx-3 hover:rounded-xl hover"
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </aside>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 bg-black left-0 right-0 flex md:hidden justify-around  border-t shadow-inner z-50">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center justify-center p-2 text-sm  transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
            {/* On mobile we hide the label for compactness */}
          </button>
        ))}
      </nav>
    </>
  );
}

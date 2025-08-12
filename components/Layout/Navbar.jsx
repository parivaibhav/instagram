"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaHome, FaSearch, FaUserCircle, FaCommentDots } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    {
      label: "Feed",
      href: "/feed",
      icon: <FaHome />,
    },
    {
      label: "Explore",
      href: "/explore",
      icon: <FaSearch />,
    },
    {
      label: "Messages",
      href: "/messages",
      icon: <FaCommentDots />,
    },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full md:relative md:border-none md:w-auto md:flex md:justify-center md:space-x-8 py-2 z-40">
      <ul className="flex justify-around md:justify-center md:space-x-8 max-w-4xl mx-auto w-full">
        {navItems.map(({ label, href, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex flex-col items-center justify-center text-sm md:text-base px-4 py-2 hover:text-black transition ${
                isActive(href) ? "text-black font-semibold" : "text-gray-500"
              }`}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <span className="text-lg">{icon}</span>
              <span className="mt-1">{label}</span>
            </Link>
          </li>
        ))}

        {/* Profile link */}
        {session ? (
          <li>
            <Link
              href={`/profile/${session.user.name}`}
              className="flex flex-col items-center justify-center text-sm md:text-base px-4 py-2 hover:text-black transition text-gray-500"
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <FaUserCircle size={24} />
              )}
              <span className="mt-1">Profile</span>
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

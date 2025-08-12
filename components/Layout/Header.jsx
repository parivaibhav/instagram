"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  FaHome,
  FaSearch,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/feed" className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="Instagram Logo"
            width={40}
            height={40}
            priority
          />
          <span className="font-bold text-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Instagram
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-700">
          <Link href="/feed" className="hover:text-gray-900" title="Home">
            <FaHome size={20} />
          </Link>
          <Link href="/explore" className="hover:text-gray-900" title="Explore">
            <FaSearch size={20} />
          </Link>
          {session ? (
            <>
              <Link href={`/profile/${session.user.name}`} title="Profile">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <FaUserCircle size={32} />
                )}
              </Link>
              <button
                onClick={() => signOut()}
                className="ml-4 text-sm font-semibold text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hover:text-gray-900 font-semibold"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="ml-4 px-3 py-1 border rounded text-sm font-semibold hover:bg-gray-100"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <ul className="flex flex-col space-y-2 px-4 py-3">
            <li>
              <Link
                href="/feed"
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/explore"
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link
                    href={`/profile/${session.user.name}`}
                    className="block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-2 text-red-600 font-semibold"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth/login"
                    className="block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="block py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

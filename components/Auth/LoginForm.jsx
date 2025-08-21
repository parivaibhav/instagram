"use client";
import React, { useState } from "react";
import { FaMeta } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // email/username/mobile
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/feed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-sm p-10">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Image
            src="/images/logo.png"
            alt="Instagram"
            width={40}
            height={40}
            priority
          />
          <h1
            className="text-3xl font-bold font-sans tracking-tight 
                  bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600
                  bg-clip-text text-transparent"
          >
            Instagram
          </h1>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Phone number, username, or email"
            className="w-full px-4 py-2 text-sm rounded border border-gray-300 bg-gray-50
                       focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400
                       placeholder-gray-400 text-black"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 text-sm rounded border border-gray-300 bg-gray-50
                       focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400
                       placeholder-gray-400 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-[12px] text-blue-500 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold rounded py-2
                       hover:bg-blue-600 transition"
          >
            Log In
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Facebook Login Placeholder */}
        <button
          className="flex justify-center items-center space-x-2 text-sm font-semibold text-blue-800 mx-auto"
          type="button"
          onClick={() => alert("Facebook login coming soon!")}
        >
          <svg
            className="w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M22 12a10 10 0 10-11.5 9.87v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2v1.7h2.3l-.4 3h-1.9v7A10 10 0 0022 12z" />
          </svg>
          <span>Log in with Facebook</span>
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </p>

        {/* Meta Footer */}
        <div className="flex justify-center items-center space-x-2 mt-8 text-gray-400">
          <FaMeta className="text-xl" />
          <span className="text-sm">Meta</span>
        </div>
      </div>
    </div>
  );
}

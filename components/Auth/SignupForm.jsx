"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function SignUpPage() {
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/auth/signup", form);

      if (response.status === 201) {
        setSuccess("Account created successfully! You can now log in.");
        setForm({ email: "", fullName: "", username: "", password: "" });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col w-full max-w-sm mt-12">
        <div className="bg-white border border-gray-300 px-8 py-10 flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Instagram"
            width={50}
            height={50}
            priority
          />
          <p className="text-gray-500 font-semibold text-center mt-4 mb-6">
            Sign up to see photos and videos from your friends.
          </p>

          {/* Success & Error Messages */}
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <input
              type="email"
              name="email"
              placeholder="Mobile Number or Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-black border-gray-300 bg-gray-50 text-sm rounded focus:outline-none focus:border-gray-400"
              required
            />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 text-black border border-gray-300 bg-gray-50 text-sm rounded focus:outline-none focus:border-gray-400"
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-black border-gray-300 bg-gray-50 text-sm rounded focus:outline-none focus:border-gray-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-black border-gray-300 bg-gray-50 text-sm rounded focus:outline-none focus:border-gray-400"
              required
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              People who use our service may have uploaded your contact
              information to Instagram.{" "}
              <Link href="#" className="text-blue-500">
                Learn More
              </Link>
            </p>
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{" "}
              <Link href="#" className="text-blue-500">
                Terms
              </Link>
              ,{" "}
              <Link href="#" className="text-blue-500">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-500">
                Cookies Policy
              </Link>
              .
            </p>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded font-semibold text-sm mt-2"
            >
              Sign up
            </button>
          </form>

          <div className="bg-white text-center  mt-4">
            <p className="text-sm text-gray-500">
              Have an account?{" "}
              <Link href="/auth/login" className="text-blue-500 font-semibold">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

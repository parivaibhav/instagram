"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef(null);

  // Check validity whenever email changes
  useEffect(() => {
    if (formRef.current) {
      setIsFormValid(formRef.current.checkValidity());
    }
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(
      "If this email is linked to an account, a reset link has been sent."
    );
    console.log("Reset link sent to:", email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm border border-gray-300 bg-white p-8 rounded-lg shadow-sm">
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

        {/* Description */}
        <p className="text-sm text-gray-500 text-center mb-4">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-3"
          noValidate
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
            required
            className="w-full rounded text-black border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />

          {message && (
            <p className="text-xs text-green-600 animate-fadeIn">{message}</p>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full rounded py-2 text-sm font-semibold text-white transition-colors ${
              isFormValid
                ? "bg-[#0095f6] hover:bg-[#1877f2]"
                : "bg-[#b2dffc] cursor-not-allowed"
            }`}
          >
            Send Login Link
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-xs text-gray-500 font-semibold">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Back to login */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-[#00376b] font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

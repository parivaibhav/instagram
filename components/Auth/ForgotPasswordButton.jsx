"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotResetPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // if token exists, we are on reset page
  const router = useRouter();

  // Shared state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  // Form validation
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    if (formRef.current) setIsFormValid(formRef.current.checkValidity());
  }, [email, password]);

  /** Forgot password submit */
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Something went wrong.");
    }
    setLoading(false);
  };

  /** Reset password submit */
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      if (res.ok) setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      setMessage("Something went wrong.");
    }
    setLoading(false);
  };

  /** Validate reset token */
  const [validToken, setValidToken] = useState(false);
  useEffect(() => {
    if (!token) return;
    fetch(`/api/auth/validate-reset-token?token=${token}`)
      .then((res) => res.json())
      .then((data) => setValidToken(data.valid))
      .catch(() => setValidToken(false));
  }, [token]);

  // Render
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm border border-gray-300 bg-white p-8 rounded-lg shadow-md animate-fadeIn">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Instagram
          </h1>
        </div>

        {/* Description */}
        {!token ? (
          <p className="text-sm text-gray-500 text-center mb-4">
            Enter your email and we’ll send you a link to reset your password.
          </p>
        ) : (
          <p className="text-sm text-gray-500 text-center mb-4">
            Enter a new password below. Token is valid for 5 minutes.
          </p>
        )}

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={token ? handleResetSubmit : handleForgotSubmit}
          className="space-y-3"
          noValidate
        >
          {!token && (
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
          )}

          {token && (
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
              }}
              required
              minLength={6}
              className="w-full rounded text-black border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          )}

          {message && (
            <p
              className={`text-xs mt-1 ${
                message.includes("success") ? "text-green-600" : "text-red-500"
              } animate-fadeIn`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full rounded py-2 text-sm font-semibold text-white transition-colors ${
              isFormValid
                ? "bg-[#0095f6] hover:bg-[#1877f2]"
                : "bg-[#b2dffc] cursor-not-allowed"
            }`}
          >
            {loading
              ? "Processing..."
              : token
              ? "Reset Password"
              : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login */}
        <div className="text-center mt-4">
          <a
            href="/auth/login"
            className="text-sm text-[#00376b] font-semibold hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

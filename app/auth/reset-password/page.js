"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const validations = {
        length: password.length >= 8,
        number: /\d/.test(password),
        uppercase: /[A-Z]/.test(password),
        match: password === confirm && password !== "",
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validations.length || !validations.number || !validations.uppercase) {
            setError("Password does not meet the required conditions.");
            setSuccess("");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match.");
            setSuccess("");
            return;
        }
        setError("");

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        if (res.ok) {
            setSuccess("Password reset successfully. Redirecting to login...");
            setTimeout(() => router.push("/auth/login"), 2000);
        } else {
            setError(data.error || "Something went wrong.");
            setSuccess("");
        }
    }

    if (!token) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-red-600 text-lg font-medium">
                    Invalid or missing reset token
                </p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="p-8 bg-white shadow-md border border-gray-200 rounded-xl w-full max-w-sm"
            >
                {/* Logo */}
                <div className="flex items-center justify-center space-x-2 mb-8">
                    <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                        Instagram
                    </h1>
                </div>

                {/* Password Input */}
                <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />

                {/* Confirm Password Input */}
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />

                {/* Validation Checklist */}
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p className={validations.length ? "text-green-600" : "text-red-500"}>
                        • Minimum 8 characters
                    </p>
                    <p className={validations.number ? "text-green-600" : "text-red-500"}>
                        • At least one number
                    </p>
                    <p className={validations.uppercase ? "text-green-600" : "text-red-500"}>
                        • At least one uppercase letter
                    </p>
                    <p className={validations.match ? "text-green-600" : "text-red-500"}>
                        • Passwords match
                    </p>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

                {/* Success Message */}
                {success && <p className="text-green-600 text-sm mb-3 text-center">{success}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-3 rounded-lg"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}

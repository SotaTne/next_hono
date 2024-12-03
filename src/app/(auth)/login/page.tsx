"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (provider: "google" | "discord") => {
    const loginUrl = `/api/auth/login/${provider}`;
    router.push(loginUrl); // リダイレクト
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="space-y-4">
        <button
          onClick={() => handleLogin("google")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
        >
          Login with Google
        </button>
        <button
          onClick={() => handleLogin("discord")}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full"
        >
          Login with Discord
        </button>
      </div>
    </div>
  );
}

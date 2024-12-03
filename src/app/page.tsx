"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ログイン状態の確認
  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await fetch("/api/auth/login");

      if (response.ok) {
        // セッションがあればログイン状態
        setIsLoggedIn(true);
      } else {
        // セッションがなければログインしていない
        setIsLoggedIn(false);
      }

      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Todo App</h1>

      <div className="space-y-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push("/users/me")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
            >
              My Page
            </button>
            <button
              onClick={() => router.push("/api/auth/logout")}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
            >
              Log Out
            </button>
            <button
              onClick={() => router.push("/api/todos")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            >
              Todo List
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/api/todos")}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-full"
            >
              Todo List (Public)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

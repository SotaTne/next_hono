"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch("/api/auth/logout", { method: "POST" });
        if (response.ok) {
          alert("Logged out successfully.");
          router.push("/login");
        } else {
          alert("Failed to logout.");
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <p>Logging out...</p>
    </div>
  );
}

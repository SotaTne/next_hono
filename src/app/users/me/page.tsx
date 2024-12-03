"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users/me");
        if (response.ok) {
          const data = (await response.json()).props;
          setUser(data);
          setNewName(data.name); // 編集用の名前初期値
        } else {
          console.error("Failed to fetch user profile.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const updatedUser = (await response.json()).props;
        setUser(updatedUser);
        setEditing(false);
      } else {
        console.error("Failed to edit user.");
      }
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    const confirm = window.confirm(
      "Are you sure you want to delete your account?",
    );
    if (!confirm) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Account deleted successfully.");
        router.push("/"); // ホームページにリダイレクト
      } else {
        console.error("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        alert("Logged out successfully.");
        router.push("/login"); // ログインページにリダイレクト
      } else {
        console.error("Failed to logout.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User profile not found.</p>;
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow rounded border">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {editing ? (
        <div>
          <label className="block mb-2 font-medium">Edit Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-2 border rounded w-full mb-4"
          />
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-4 mr-2"
          >
            Edit
          </button>
        </div>
      )}

      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-4 mr-2"
      >
        Delete Account
      </button>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mt-4"
      >
        Logout
      </button>
    </div>
  );
}

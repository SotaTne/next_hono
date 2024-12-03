"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
};

export default function UserDetail() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const data = (await response.json()).props;
          setUser(data);
        } else {
          console.error("User not found.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow rounded border">
      <h1 className="text-2xl font-bold mb-4">User Details</h1>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  name: string;
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/users");
        const data = (await response.json()).props;
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <ul className="space-y-4">
      {users.map((user) => (
        <li key={user.id} className="p-4 bg-white shadow rounded border">
          <Link href={`/users/${user.id}`} className="block">
            <h3 className="font-bold text-blue-600 hover:underline">
              {user.name}
            </h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}

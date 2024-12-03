"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Todo = {
  id: string;
  title: string;
  creator: string;
  isPrivate: boolean;
  completed: boolean;
};

export default function TodoDetailPage() {
  // paramsからtodoIdを取得
  const params = useParams<{ todoId: string }>();
  const todoId = params.todoId;
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const router = useRouter();

  // 以下、以前のコードをそのまま使用
  useEffect(() => {
    const fetchTodo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/todos/${todoId}`);
        if (res.ok) {
          const data = await res.json();
          setTodo(data);
          setTitle(data.title);
          setIsPrivate(data.isPrivate);
        } else {
          router.replace("/todos");
        }
      } catch (error) {
        console.error("Failed to fetch todo:", error);
        router.replace("/todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [todoId, router]);

  // Handle Edit Submission
  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, isPrivate }),
      });
      if (res.ok) {
        const updatedTodo = await res.json();
        setTodo(updatedTodo);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  // Handle Mark as Complete
  const handleComplete = async () => {
    try {
      const res = await fetch(`/api/todos/${todoId}/complete`, {
        method: "POST",
      });
      if (res.ok) {
        const updatedTodo = await res.json();
        setTodo(updatedTodo);
      }
    } catch (error) {
      console.error("Failed to mark todo as complete:", error);
    }
  };

  // Handle Delete Todo
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.replace("/todos"); // Redirect to the list page
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!todo) {
    return <p>Todo not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded border p-6">
        {isEditing ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Edit Todo</h1>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Private
              </label>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mt-1"
              />
            </div>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{todo.title}</h1>
            <p className="text-gray-600 mb-2">
              <strong>Creator:</strong> {todo.creator}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Status:</strong>{" "}
              {todo.completed ? (
                <span className="text-green-500 font-semibold">Completed</span>
              ) : (
                <span className="text-red-500 font-semibold">Incomplete</span>
              )}
            </p>
            {todo.isPrivate && (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
                Private
              </span>
            )}
            <div className="mt-4 flex space-x-4">
              {!todo.completed && (
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Mark as Complete
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

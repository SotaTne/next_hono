import { useEffect, useState } from "react";
import Link from "next/link";

type Todo = {
  id: string;
  title: string;
  creator: string;
  isPrivate: boolean;
};

type TodosListProps = {
  showAll: boolean;
};

export default function TodosList({ showAll }: TodosListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      const endpoint = showAll ? "/api/todos" : "/api/todos/my";
      const response = await fetch(endpoint);
      const data = (await response.json()).props;
      setTodos(data);
      setLoading(false);
    };

    fetchTodos();
  }, [showAll]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (todos.length === 0) {
    return <p>No todos found.</p>;
  }

  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="p-4 bg-white shadow rounded border hover:bg-gray-100 transition"
        >
          <Link href={`/todos/${todo.id}`} className="block">
            <h3 className="font-bold text-blue-600 hover:underline">
              {todo.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm">Created by: {todo.creator}</p>
          {todo.isPrivate && (
            <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
              Private
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

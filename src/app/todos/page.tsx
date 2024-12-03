"use client";

import { useState } from "react";
import TodosList from "@/components/TodosList";

export default function TodosPage() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Todos</h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showAll ? "Show My Todos" : "Show All Todos"}
        </button>
      </div>
      <TodosList showAll={showAll} />
    </div>
  );
}

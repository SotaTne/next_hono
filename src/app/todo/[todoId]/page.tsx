"use client";

import { useParams } from "next/navigation";

export default function ExampleClientComponent() {
  const params = useParams<{ todoId: string }>();
  return (
    <div>
      <h1>ToDo App Home</h1>
      <p>Todo Id: {params.todoId}</p>
    </div>
  );
}

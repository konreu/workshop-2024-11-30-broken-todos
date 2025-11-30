"use client";

import { useEffect, useState } from "react";
import { getTodos } from "./actions";

export function TodoCount() {
  const [count, setCount] = useState({ completed: 0, total: 0 });

  // Fetch count on mount - but this won't update when todos change!
  useEffect(() => {
    const fetchCount = async () => {
      const todos = await getTodos();
      setCount({
        completed: todos.filter((t) => t.completed).length,
        total: todos.length,
      });
    };
    fetchCount();
  }, []); // Empty deps = only runs once on mount

  if (count.total === 0) {
    return null;
  }

  return (
    <p className="text-sm font-medium text-indigo-600">
      {count.completed} of {count.total} completed
    </p>
  );
}

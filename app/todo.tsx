"use client";

import { useTransition, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { InferSelectModel } from "drizzle-orm";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { todosTable } from "@/db/schema";
import { removeTodoAction, toggleTodoAction, reorderTodosAction } from "./actions";
import { DragHandle } from "./drag-handle";

// Dynamically import react-confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export function Todo({
  item,
  allTodos,
}: {
  item: InferSelectModel<typeof todosTable>;
  allTodos: InferSelectModel<typeof todosTable>[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Local state for immediate UI feedback
  const [isCompleted, setIsCompleted] = useState(item.completed);
  const [isDeleted, setIsDeleted] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    // Update window size when mounted
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Initial size
    updateWindowSize();

    // Add event listener
    window.addEventListener("resize", updateWindowSize);

    // Cleanup
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Handle toggle and trigger confetti if todo becomes completed
  const handleToggle = async () => {
    // If the todo is currently not completed, toggling will complete it
    if (!isCompleted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
    }

    // Update local state immediately for smooth UX
    setIsCompleted(!isCompleted);

    // Persist to server in background
    startTransition(() => {
      toggleTodoAction(item.id);
    });
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (!event.altKey) return;

    const currentIndex = allTodos.findIndex((t) => t.id === item.id);
    let newIndex = currentIndex;

    if (event.key === "ArrowUp" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (event.key === "ArrowDown" && currentIndex < allTodos.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return;
    }

    event.preventDefault();

    // Calculate the proper new position (between adjacent items)
    const newPosition = calculateNewPosition(allTodos, currentIndex, newIndex);

    startTransition(async () => {
      await reorderTodosAction(item.id, newPosition);
    });
  };

  // Calculate a position value between adjacent items for proper ordering
  const calculateNewPosition = (
    todos: { position: number }[],
    fromIndex: number,
    toIndex: number
  ): number => {
    if (toIndex > fromIndex) {
      // Moving down
      const before = todos[toIndex];
      const after = todos[toIndex + 1];
      if (!after) {
        return before.position + 1000;
      }
      return Math.floor((before.position + after.position) / 2);
    } else {
      // Moving up
      const after = todos[toIndex];
      const before = todos[toIndex - 1];
      if (!before) {
        return Math.floor(after.position / 2);
      }
      return Math.floor((before.position + after.position) / 2);
    }
  };

  const handleRemove = async () => {
    // Update local state immediately for smooth UX
    setIsDeleted(true);

    // Persist to server in background
    startTransition(() => {
      removeTodoAction(item.id);
    });
  };

  // Extract role from attributes to avoid setting role="button" on <li>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { role, ...restAttributes } = attributes;

  // Don't render if deleted locally
  if (isDeleted) {
    return null;
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between px-5 py-4 transition-colors duration-150 hover:bg-slate-50 ${isDragging ? "opacity-50" : ""}`}
      {...restAttributes}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <div className="flex w-full items-center gap-4">
        {/* Drag Handle */}
        <DragHandle listeners={listeners} />

        {/* Custom Checkbox */}
        <button
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            isCompleted
              ? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-200"
              : "border-slate-300 hover:border-indigo-400 hover:shadow-sm"
          } ${isPending ? "opacity-50" : ""} `}
          onClick={handleToggle}
          disabled={isPending}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted && (
            <svg
              className="animate-check h-3.5 w-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Todo Text */}
        <span
          className={`flex-1 text-base transition-all duration-200 ${
            isCompleted ? "text-slate-400 line-through" : "text-slate-700"
          } `}
        >
          {item.description}
        </span>
      </div>

      {/* Delete Button */}
      <button
        className="rounded-lg p-2 text-slate-400 opacity-0 transition-all duration-150 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 focus:opacity-100 focus:ring-2 focus:ring-red-200 focus:outline-none"
        onClick={handleRemove}
        disabled={isPending}
        aria-label="Delete todo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </li>
  );
}

import { Todos } from "./todos";
import { TodoCount } from "./todo-count";

export default async function Page() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2 pb-4 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">My Todos</h1>
        <p className="text-lg text-slate-500">Stay organized, get things done</p>
        <TodoCount />
      </div>

      {/* Todo List Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
        <Todos />
      </div>

      {/* Footer */}
      <p className="pt-4 text-center text-sm text-slate-400">
        Your todos are saved automatically ✨
      </p>
    </div>
  );
}

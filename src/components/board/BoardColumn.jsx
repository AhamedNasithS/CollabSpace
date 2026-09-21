import {
  MoreHorizontal,
  Plus,
} from "lucide-react";

import {
  useDroppable,
} from "@dnd-kit/core";

import TaskCard from "../tasks/TaskCard";

function BoardColumn({
  status,
  title,
  count,
  tasks,
  currentUser,
  onAddTask,
  onTaskClick,
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: status,

    data: {
      type: "column",
      status,
    },
  });

  return (
    <section
      ref={setNodeRef}
      data-column-status={status}
      className={`
        w-[300px]
        min-h-[220px]
        shrink-0
        rounded-card
        border
        p-3
        transition-colors

        ${
          isOver
            ? "border-primary bg-indigo-50"
            : "border-border bg-slate-50/70"
        }
      `}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />

          <h2 className="text-sm font-medium text-heading">
            {title}
          </h2>

          <span className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[11px] text-muted">
            {count}
          </span>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={onAddTask}
            className="rounded-control p-1.5 text-muted hover:bg-surface hover:text-heading"
          >
            <Plus size={15} />
          </button>

          <button
            type="button"
            className="rounded-control p-1.5 text-muted hover:bg-surface hover:text-heading"
          >
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      <div className="mt-3 min-h-[140px] space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentUser={currentUser}
            onClick={() =>
              onTaskClick?.(task)
            }
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddTask}
        className="
          mt-3 flex w-full items-center justify-center gap-1
          rounded-control
          border border-dashed border-border
          px-3 py-2
          text-xs text-muted
          hover:border-border-strong
          hover:bg-surface
          hover:text-heading
        "
      >
        <Plus size={14} />
        Add task
      </button>
    </section>
  );
}

export default BoardColumn;
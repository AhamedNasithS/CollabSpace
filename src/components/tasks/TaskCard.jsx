import {
  CalendarDays,
  GripVertical,
  MessageSquare,
} from "lucide-react";

import {
  useDraggable,
} from "@dnd-kit/core";

import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_VARIANTS,
} from "../../constants/priorities";

function formatDueDate(timestamp) {
  if (!timestamp?.toDate) {
    return null;
  }

  return timestamp
    .toDate()
    .toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
      }
    );
}

function TaskCard({
  task,
  currentUser,
  onClick,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,

    data: {
      type: "task",
      task,
    },
  });

  const dueDate =
    formatDueDate(task.dueAt);

  const style = transform
    ? {
        transform:
          `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`
        rounded-card
        border border-border
        bg-surface
        p-4
        transition
        hover:border-border-strong
        hover:shadow-sm
        cursor-pointer

        ${
          isDragging
            ? "z-50 opacity-60 shadow-floating"
            : ""
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-medium text-subtle">
          {task.key}
        </span>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              TASK_PRIORITY_VARIANTS[
                task.priority
              ]
            }
          >
            {
              TASK_PRIORITY_LABELS[
                task.priority
              ]
            }
          </Badge>

          <button
            type="button"
            {...listeners}
            {...attributes}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              cursor-grab
              rounded-control
              p-1
              text-subtle
              hover:bg-surface-muted
              hover:text-heading
              active:cursor-grabbing
            "
            aria-label={`Move ${task.title}`}
          >
            <GripVertical
              size={15}
            />
          </button>
        </div>
      </div>

      <h3 className="mt-2 text-sm font-medium leading-5 text-heading">
        {task.title}
      </h3>

      {task.description && (
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted">
          {dueDate && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays
                size={13}
              />

              {dueDate}
            </span>
          )}

          {task.commentCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare
                size={13}
              />

              {task.commentCount}
            </span>
          )}
        </div>

        {task.assigneeId && (
          <Avatar
            name={
              task.assigneeId ===
              currentUser?.uid
                ? currentUser.displayName ||
                  currentUser.email
                : "Team member"
            }
            size="sm"
          />
        )}
      </div>
    </article>
  );
}

export default TaskCard;
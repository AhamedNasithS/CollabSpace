import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Search,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import Badge from "../../components/ui/Badge";

import {
  TASK_PRIORITY_LABELS,
  TASK_PRIORITY_VARIANTS,
} from "../../constants/priorities";

import {
  TASK_STATUS,
  TASK_STATUS_LABELS,
} from "../../constants/taskStatus";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

import {
  subscribeToMyTasks,
} from "../../services/taskService";

const FILTERS = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "open",
    label: "Open",
  },
  {
    id: "completed",
    label: "Completed",
  },
];

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
        year: "numeric",
      }
    );
}

function isOverdue(task) {
  if (
    !task.dueAt?.toDate ||
    task.status ===
      TASK_STATUS.COMPLETED
  ) {
    return false;
  }

  const dueDate =
    task.dueAt.toDate();

  return (
    dueDate.getTime() <
    Date.now()
  );
}

function MyTasksPage() {
  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const {
    currentWorkspace,
  } = useWorkspace();

  const [tasks, setTasks] =
    useState([]);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [search, setSearch] =
    useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    loadedKey,
    setLoadedKey,
  ] = useState(null);

  const workspaceId =
    currentWorkspace?.id;

  const userId =
    user?.uid;

  const requestKey =
    workspaceId && userId
      ? `${workspaceId}:${userId}`
      : null;

  const loading =
    Boolean(requestKey) &&
    loadedKey !== requestKey;

  useEffect(() => {
    if (
      !workspaceId ||
      !userId
    ) {
      return;
    }

    const currentKey =
      `${workspaceId}:${userId}`;

    const unsubscribe =
      subscribeToMyTasks({
        workspaceId,
        userId,

        onData: (data) => {
          setTasks(data);
          setError("");

          setLoadedKey(
            currentKey
          );
        },

        onError: (error) => {
          console.error(
            "My tasks subscription failed:",
            error
          );

          setError(
            "Unable to load your tasks."
          );

          setLoadedKey(
            currentKey
          );
        },
      });

    return unsubscribe;
  }, [
    workspaceId,
    userId,
  ]);

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const visibleTasks =
    tasks.filter((task) => {
      if (
        activeFilter ===
          "completed" &&
        task.status !==
          TASK_STATUS.COMPLETED
      ) {
        return false;
      }

      if (
        activeFilter ===
          "open" &&
        task.status ===
          TASK_STATUS.COMPLETED
      ) {
        return false;
      }

      if (
        normalizedSearch &&
        !task.title
          ?.toLowerCase()
          .includes(
            normalizedSearch
          ) &&
        !task.key
          ?.toLowerCase()
          .includes(
            normalizedSearch
          )
      ) {
        return false;
      }

      return true;
    });

  const openCount =
    tasks.filter(
      (task) =>
        task.status !==
        TASK_STATUS.COMPLETED
    ).length;

  const completedCount =
    tasks.filter(
      (task) =>
        task.status ===
        TASK_STATUS.COMPLETED
    ).length;

  const overdueCount =
    tasks.filter(
      isOverdue
    ).length;

  function openTask(task) {
  navigate(
    `/app/projects/${task.projectId}?task=${task.id}`
  );
}

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          My Tasks
        </h1>

        <p className="mt-1 text-sm text-muted">
          Tasks assigned to you across{" "}
          {currentWorkspace?.name ||
            "your workspace"}.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Open
          </p>

          <p className="mt-2 text-2xl font-semibold text-heading">
            {openCount}
          </p>
        </div>

        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Completed
          </p>

          <p className="mt-2 text-2xl font-semibold text-heading">
            {completedCount}
          </p>
        </div>

        <div className="rounded-card border border-border bg-surface p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Overdue
          </p>

          <p className="mt-2 text-2xl font-semibold text-heading">
            {overdueCount}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          {FILTERS.map(
            (filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() =>
                  setActiveFilter(
                    filter.id
                  )
                }
                className={`
                  rounded-control
                  px-3 py-2
                  text-sm
                  font-medium
                  transition

                  ${
                    activeFilter ===
                    filter.id
                      ? "bg-indigo-50 text-primary"
                      : "text-muted hover:bg-surface-muted hover:text-heading"
                  }
                `}
              >
                {filter.label}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
          />

          <input
            type="search"
            placeholder="Search my tasks..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="
              h-9 w-full
              rounded-control
              border border-border
              bg-surface
              pl-9 pr-3
              text-sm text-heading
              outline-none
              placeholder:text-subtle
              focus:border-primary
              focus:ring-2
              focus:ring-primary/15
            "
          />
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-muted">
          Loading your tasks...
        </div>
      ) : visibleTasks.length ===
        0 ? (
        <div className="mt-6 rounded-panel border border-border bg-surface px-6 py-16 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-muted">
            <CheckCircle2
              size={20}
            />
          </div>

          <h2 className="mt-4 text-sm font-medium text-heading">
            No tasks found
          </h2>

          <p className="mt-1 text-sm text-muted">
            {tasks.length === 0
              ? "You don't have any assigned tasks yet."
              : "No tasks match the current filter."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-panel border border-border bg-surface">
          {visibleTasks.map(
            (task) => {
              const dueDate =
                formatDueDate(
                  task.dueAt
                );

              const overdue =
                isOverdue(task);

              const completed =
                task.status ===
                TASK_STATUS.COMPLETED;

              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() =>
                    openTask(task)
                  }
                  className="
                    flex w-full
                    items-start
                    gap-4
                    border-b
                    border-border
                    px-5 py-4
                    text-left
                    transition
                    last:border-b-0
                    hover:bg-slate-50
                  "
                >
                  <div className="pt-0.5">
                    {completed ? (
                      <CheckCircle2
                        size={18}
                        className="text-success"
                      />
                    ) : (
                      <Circle
                        size={18}
                        className="text-subtle"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-subtle">
                            {task.key}
                          </span>

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
                        </div>

                        <p
                          className={`
                            mt-2 text-sm font-medium

                            ${
                              completed
                                ? "text-muted line-through"
                                : "text-heading"
                            }
                          `}
                        >
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="mt-1 line-clamp-1 text-xs text-muted">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <span className="rounded-md bg-surface-muted px-2 py-1 text-xs font-medium text-body">
                          {
                            TASK_STATUS_LABELS[
                              task.status
                            ]
                          }
                        </span>

                        {dueDate && (
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1
                              text-xs

                              ${
                                overdue
                                  ? "font-medium text-danger"
                                  : "text-muted"
                              }
                            `}
                          >
                            <CalendarDays
                              size={13}
                            />

                            {dueDate}

                            {overdue &&
                              " · Overdue"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default MyTasksPage;
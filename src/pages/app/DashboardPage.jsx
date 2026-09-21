import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
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
  subscribeToWorkspaceActivity,
} from "../../services/activityService";

import {
  subscribeToWorkspaceProjects,
} from "../../services/projectService";

import {
  subscribeToWorkspaceTasks,
} from "../../services/taskService";

import {
  formatRelativeTime,
} from "../../utils/date";

function isTaskOverdue(task) {
  if (
    !task.dueAt?.toDate ||
    task.status ===
      TASK_STATUS.COMPLETED
  ) {
    return false;
  }

  return (
    task.dueAt
      .toDate()
      .getTime() <
    Date.now()
  );
}

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

function getActivityText(activity) {
  switch (activity.type) {
    case "task_created":
      return "created a task";

    case "task_status_changed":
      return "moved a task";

    case "task_commented":
      return "commented on a task";

    case "task_updated":
      return "updated a task";

    default:
      return "updated a task";
  }
}

function DashboardPage() {
  const navigate =
    useNavigate();

  const {
    user,
    profile,
  } = useAuth();

  const {
    currentWorkspace,
  } = useWorkspace();

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    tasks,
    setTasks,
  ] = useState([]);

  const [
    activities,
    setActivities,
  ] = useState([]);

  const [
    projectError,
    setProjectError,
  ] = useState("");

  const [
    taskError,
    setTaskError,
  ] = useState("");

  const [
    activityError,
    setActivityError,
  ] = useState("");

  const workspaceId =
    currentWorkspace?.id;

  const userId =
    user?.uid;

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    return subscribeToWorkspaceProjects({
      workspaceId,

      onData: (data) => {
        setProjects(data);
        setProjectError("");
      },

      onError: (error) => {
        console.error(
          "Dashboard project subscription failed:",
          error
        );

        setProjectError(
          "Unable to load projects."
        );
      },
    });
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    return subscribeToWorkspaceTasks({
      workspaceId,

      onData: (data) => {
        setTasks(data);
        setTaskError("");
      },

      onError: (error) => {
        console.error(
          "Dashboard task subscription failed:",
          error
        );

        setTaskError(
          "Unable to load tasks."
        );
      },
    });
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    return subscribeToWorkspaceActivity({
      workspaceId,

      onData: (data) => {
        setActivities(data);
        setActivityError("");
      },

      onError: (error) => {
        console.error(
          "Dashboard activity subscription failed:",
          error
        );

        setActivityError(
          "Unable to load activity."
        );
      },
    });
  }, [workspaceId]);

  const activeProjects =
    projects.filter(
      (project) =>
        project.status ===
        "active"
    );

  const myTasks =
    tasks.filter(
      (task) =>
        task.assigneeId ===
        userId
    );

  const myOpenTasks =
    myTasks.filter(
      (task) =>
        task.status !==
        TASK_STATUS.COMPLETED
    );

  const completedTasks =
    myTasks.filter(
      (task) =>
        task.status ===
        TASK_STATUS.COMPLETED
    );

  const overdueTasks =
    myTasks.filter(
      isTaskOverdue
    );

  const upcomingTasks =
    [...myOpenTasks]
      .sort((a, b) => {
        const first =
          a.dueAt?.seconds ??
          Number.MAX_SAFE_INTEGER;

        const second =
          b.dueAt?.seconds ??
          Number.MAX_SAFE_INTEGER;

        return first - second;
      })
      .slice(0, 5);

  const recentProjects =
    activeProjects.slice(0, 4);

  const recentActivity =
    activities.slice(0, 5);

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    "there";

  function openTask(task) {
    navigate(
      `/app/projects/${task.projectId}?task=${task.id}`
    );
  }

  return (
    <div className="w-full">
      <div>
        <p className="text-sm text-muted">
          {currentWorkspace?.name}
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-heading">
          Welcome back,{" "}
          {displayName}
        </h1>

        <p className="mt-1 text-sm text-muted">
          Here's what's happening across your workspace.
        </p>
      </div>

      {(projectError ||
        taskError ||
        activityError) && (
        <div className="mt-6 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {projectError ||
            taskError ||
            activityError}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">
              Active Projects
            </p>

            <FolderKanban
              size={18}
              className="text-primary"
            />
          </div>

          <p className="mt-3 text-3xl font-semibold text-heading">
            {activeProjects.length}
          </p>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">
              My Open Tasks
            </p>

            <ListTodo
              size={18}
              className="text-primary"
            />
          </div>

          <p className="mt-3 text-3xl font-semibold text-heading">
            {myOpenTasks.length}
          </p>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">
              Overdue
            </p>

            <Clock3
              size={18}
              className="text-danger"
            />
          </div>

          <p className="mt-3 text-3xl font-semibold text-heading">
            {overdueTasks.length}
          </p>
        </div>

        <div className="rounded-card border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">
              Completed
            </p>

            <CheckCircle2
              size={18}
              className="text-success"
            />
          </div>

          <p className="mt-3 text-3xl font-semibold text-heading">
            {completedTasks.length}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-panel border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-heading">
                My Tasks
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                Your next assigned tasks.
              </p>
            </div>

            <Link
              to="/app/my-tasks"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
            >
              View all

              <ArrowRight
                size={13}
              />
            </Link>
          </div>

          {upcomingTasks.length ===
          0 ? (
            <div className="px-5 py-12 text-center">
              <CheckCircle2
                size={22}
                className="mx-auto text-subtle"
              />

              <p className="mt-3 text-sm font-medium text-heading">
                No open tasks
              </p>

              <p className="mt-1 text-xs text-muted">
                You're caught up with your assignments.
              </p>
            </div>
          ) : (
            <div>
              {upcomingTasks.map(
                (task) => {
                  const dueDate =
                    formatDueDate(
                      task.dueAt
                    );

                  const overdue =
                    isTaskOverdue(
                      task
                    );

                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() =>
                        openTask(
                          task
                        )
                      }
                      className="
                        flex w-full
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-border
                        px-5 py-4
                        text-left
                        last:border-b-0
                        hover:bg-slate-50
                      "
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
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

                        <p className="mt-2 truncate text-sm font-medium text-heading">
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {
                            TASK_STATUS_LABELS[
                              task.status
                            ]
                          }
                        </p>
                      </div>

                      {dueDate && (
                        <span
                          className={`
                            inline-flex
                            shrink-0
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
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </section>

        <section className="rounded-panel border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-heading">
                Recent Activity
              </h2>

              <p className="mt-0.5 text-xs text-muted">
                Latest workspace changes.
              </p>
            </div>

            <Link
              to="/app/activity"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
            >
              View all

              <ArrowRight
                size={13}
              />
            </Link>
          </div>

          {recentActivity.length ===
          0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-muted">
                No activity yet.
              </p>
            </div>
          ) : (
            <div>
              {recentActivity.map(
                (activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => {
                      if (
                        activity.projectId
                      ) {
                        navigate(
                          `/app/projects/${activity.projectId}?task=${activity.taskId}`
                        );
                      }
                    }}
                    className="
                      w-full
                      border-b
                      border-border
                      px-5 py-4
                      text-left
                      last:border-b-0
                      hover:bg-slate-50
                    "
                  >
                    <p className="text-sm leading-5 text-body">
                      <span className="font-medium text-heading">
                        {activity
                          .actorSnapshot
                          ?.displayName ||
                          "User"}
                      </span>{" "}
                      {getActivityText(
                        activity
                      )}
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span className="truncate text-xs text-muted">
                        {activity
                          .metadata
                          ?.taskKey}{" "}
                        {activity
                          .metadata
                          ?.taskTitle &&
                          `· ${activity.metadata.taskTitle}`}
                      </span>

                      <span className="shrink-0 text-xs text-subtle">
                        {formatRelativeTime(
                          activity.createdAt
                        )}
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-panel border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-heading">
              Recent Projects
            </h2>

            <p className="mt-0.5 text-xs text-muted">
              Active projects in this workspace.
            </p>
          </div>

          <Link
            to="/app/projects"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
          >
            View projects

            <ArrowRight
              size={13}
            />
          </Link>
        </div>

        {recentProjects.length ===
        0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-muted">
              No active projects yet.
            </p>
          </div>
        ) : (
          <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {recentProjects.map(
              (project) => (
                <Link
                  key={project.id}
                  to={`/app/projects/${project.id}`}
                  className="p-5 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <FolderKanban
                      size={16}
                      className="text-primary"
                    />

                    <span className="text-xs font-medium text-subtle">
                      {project.code}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-semibold text-heading">
                    {project.name}
                  </h3>

                  {project.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                      {project.description}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-muted">
                    {project.taskCounter ||
                      0}{" "}
                    tasks created
                  </p>
                </Link>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
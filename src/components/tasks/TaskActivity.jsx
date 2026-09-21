import {
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Avatar from "../ui/Avatar";

import useWorkspace from "../../hooks/useWorkspace";

import {
  subscribeToTaskActivity,
} from "../../services/activityService";

import {
  TASK_STATUS_LABELS,
} from "../../constants/taskStatus";

import {
  formatRelativeTime,
} from "../../utils/date";

function getActivityContent(activity) {
  switch (activity.type) {
    case "task_created":
      return {
        icon: Plus,
        text: "created this task",
      };

    case "task_status_changed":
      return {
        icon: RefreshCw,

        text: `moved this task from ${
          TASK_STATUS_LABELS[
            activity.metadata?.fromStatus
          ] ||
          activity.metadata?.fromStatus ||
          "Unknown"
        } to ${
          TASK_STATUS_LABELS[
            activity.metadata?.toStatus
          ] ||
          activity.metadata?.toStatus ||
          "Unknown"
        }`,
      };

    case "task_commented":
      return {
        icon: MessageSquare,
        text: "added a comment",
      };

    case "task_updated":
      return {
        icon: Pencil,
        text: "updated this task",
      };

    default:
      return {
        icon: Pencil,
        text: "updated this task",
      };
  }
}

function TaskActivity({ task }) {
  const {
    currentWorkspace,
  } = useWorkspace();

  const [
    activities,
    setActivities,
  ] = useState([]);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const workspaceId =
      currentWorkspace?.id;

    if (
      !workspaceId ||
      !task?.id
    ) {
      return;
    }

    const unsubscribe =
      subscribeToTaskActivity({
        workspaceId,
        taskId: task.id,

        onData: (data) => {
          setActivities(data);
          setError("");
        },

        onError: (error) => {
          console.error(
            "Activity subscription failed:",
            error
          );

          setError(
            "Unable to load task activity."
          );
        },
      });

    return unsubscribe;
  }, [
    currentWorkspace?.id,
    task?.id,
  ]);

  if (error) {
    return (
      <div className="rounded-control border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-control border border-dashed border-border px-4 py-6 text-center">
        <p className="text-sm text-muted">
          No activity yet.
        </p>

        <p className="mt-1 text-xs text-subtle">
          Task changes and comments will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {activities.map(
        (activity) => {
          const {
            icon: Icon,
            text,
          } =
            getActivityContent(
              activity
            );

          return (
            <div
              key={activity.id}
              className="flex gap-3"
            >
              <Avatar
                name={
                  activity
                    .actorSnapshot
                    ?.displayName ||
                  "User"
                }
                src={
                  activity
                    .actorSnapshot
                    ?.photoURL ||
                  null
                }
                size="md"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm leading-5 text-body">
                    <span className="font-medium text-heading">
                      {activity
                        .actorSnapshot
                        ?.displayName ||
                        "User"}
                    </span>{" "}
                    {text}
                  </p>

                  <span className="shrink-0 text-xs text-subtle">
                    {formatRelativeTime(
                      activity.createdAt
                    )}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-subtle">
                  <Icon size={12} />

                  <span>
                    {activity.metadata
                      ?.taskKey ||
                      task.key}
                  </span>
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

export default TaskActivity;
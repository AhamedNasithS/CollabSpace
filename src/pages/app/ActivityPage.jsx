import {
    CheckCircle2,
    MessageSquare,
    Pencil,
    Plus,
    RefreshCw,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router";

import Avatar from "../../components/ui/Avatar";

import {
    TASK_STATUS_LABELS,
} from "../../constants/taskStatus";

import useWorkspace from "../../hooks/useWorkspace";

import {
    subscribeToWorkspaceActivity,
} from "../../services/activityService";

import {
    formatRelativeTime,
} from "../../utils/date";

const FILTERS = [
    {
        id: "all",
        label: "All activity",
    },
    {
        id: "tasks",
        label: "Task changes",
    },
    {
        id: "comments",
        label: "Comments",
    },
];

function getActivityContent(
    activity
) {
    switch (activity.type) {
        case "task_created":
            return {
                icon: Plus,
                text: "created a task",
            };

        case "task_status_changed": {
            const fromStatus =
                TASK_STATUS_LABELS[
                activity.metadata
                    ?.fromStatus
                ] ||
                activity.metadata
                    ?.fromStatus ||
                "Unknown";

            const toStatus =
                TASK_STATUS_LABELS[
                activity.metadata
                    ?.toStatus
                ] ||
                activity.metadata
                    ?.toStatus ||
                "Unknown";

            return {
                icon: RefreshCw,

                text: `moved a task from ${fromStatus} to ${toStatus}`,
            };
        }

        case "task_commented":
            return {
                icon: MessageSquare,
                text:
                    "commented on a task",
            };

        case "task_updated":
            return {
                icon: Pencil,
                text: "updated a task",
            };

        default:
            return {
                icon: CheckCircle2,
                text:
                    "updated workspace activity",
            };
    }
}

function ActivityPage() {
    const navigate =
        useNavigate();

    const {
        currentWorkspace,
    } = useWorkspace();

    const [
        activities,
        setActivities,
    ] = useState([]);

    const [
        activeFilter,
        setActiveFilter,
    ] = useState("all");

    const [
        error,
        setError,
    ] = useState("");

    const [
        loadedWorkspaceId,
        setLoadedWorkspaceId,
    ] = useState(null);

    const workspaceId =
        currentWorkspace?.id;

    const loading =
        Boolean(workspaceId) &&
        loadedWorkspaceId !==
        workspaceId;

    useEffect(() => {
        if (!workspaceId) {
            return;
        }

        const unsubscribe =
            subscribeToWorkspaceActivity({
                workspaceId,

                onData: (data) => {
                    setActivities(data);
                    setError("");

                    setLoadedWorkspaceId(
                        workspaceId
                    );
                },

                onError: (error) => {
                    console.error(
                        "Workspace activity subscription failed:",
                        error
                    );

                    setError(
                        "Unable to load workspace activity."
                    );

                    setLoadedWorkspaceId(
                        workspaceId
                    );
                },
            });

        return unsubscribe;
    }, [workspaceId]);

    const visibleActivities =
        activities.filter(
            (activity) => {
                if (
                    activeFilter ===
                    "comments"
                ) {
                    return (
                        activity.type ===
                        "task_commented"
                    );
                }

                if (
                    activeFilter ===
                    "tasks"
                ) {
                    return (
                        activity.type !==
                        "task_commented"
                    );
                }

                return true;
            }
        );

    function handleActivityClick(
        activity
    ) {
        if (
            activity.projectId &&
            activity.taskId
        ) {
            navigate(
                `/app/projects/${activity.projectId}?task=${activity.taskId}`
            );

            return;
        }

        if (activity.projectId) {
            navigate(
                `/app/projects/${activity.projectId}`
            );
        }
    }

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-heading">
                    Workspace Activity
                </h1>

                <p className="mt-1 text-sm text-muted">
                    Recent collaboration across{" "}
                    {currentWorkspace?.name ||
                        "your workspace"}.
                </p>
            </div>

            <div className="mt-6 flex items-center gap-1 border-b border-border">
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
                -mb-px
                border-b-2
                px-3 py-3
                text-sm
                font-medium
                transition

                ${activeFilter ===
                                    filter.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted hover:text-heading"
                                }
              `}
                        >
                            {filter.label}
                        </button>
                    )
                )}
            </div>

            {error && (
                <div className="mt-6 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="py-16 text-center text-sm text-muted">
                    Loading activity...
                </div>
            ) : visibleActivities.length ===
                0 ? (
                <div className="mt-6 rounded-panel border border-border bg-surface px-6 py-16 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-muted">
                        <RefreshCw
                            size={19}
                        />
                    </div>

                    <h2 className="mt-4 text-sm font-medium text-heading">
                        No activity yet
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Task changes and comments will appear here.
                    </p>
                </div>
            ) : (
                <div className="mt-6 overflow-hidden rounded-panel border border-border bg-surface">
                    {visibleActivities.map(
                        (activity) => {
                            const {
                                icon: Icon,
                                text,
                            } =
                                getActivityContent(
                                    activity
                                );

                            return (
                                <button
                                    key={activity.id}
                                    type="button"
                                    onClick={() =>
                                        handleActivityClick(
                                            activity
                                        )
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
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm leading-5 text-body">
                                                    <span className="font-medium text-heading">
                                                        {activity
                                                            .actorSnapshot
                                                            ?.displayName ||
                                                            "User"}
                                                    </span>{" "}
                                                    {text}
                                                </p>

                                                {(activity
                                                    .metadata
                                                    ?.taskKey ||
                                                    activity
                                                        .metadata
                                                        ?.taskTitle) && (
                                                        <p className="mt-1 text-sm font-medium text-heading">
                                                            {activity
                                                                .metadata
                                                                ?.taskKey}

                                                            {activity
                                                                .metadata
                                                                ?.taskKey &&
                                                                activity
                                                                    .metadata
                                                                    ?.taskTitle &&
                                                                " · "}

                                                            {activity
                                                                .metadata
                                                                ?.taskTitle}
                                                        </p>
                                                    )}
                                            </div>

                                            <span className="shrink-0 text-xs text-subtle">
                                                {formatRelativeTime(
                                                    activity.createdAt
                                                )}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                                            <Icon size={13} />

                                            {activity.type ===
                                                "task_commented"
                                                ? "Comment"
                                                : "Task activity"}
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

export default ActivityPage;
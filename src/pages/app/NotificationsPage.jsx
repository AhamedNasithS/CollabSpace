import {
    Bell,
    CheckCheck,
    MessageSquare,
    UserPlus,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router";

import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

import {
    markAllNotificationsRead,
    markNotificationRead,
    subscribeToNotifications,
} from "../../services/notificationService";

import {
    formatRelativeTime,
} from "../../utils/date";

function getNotificationContent(
    notification
) {
    switch (
    notification.type
    ) {
        case "task_assigned":
            return {
                icon: UserPlus,

                text:
                    "assigned you a task",
            };

        case "task_commented":
            return {
                icon:
                    MessageSquare,

                text:
                    "commented on your task",
            };

        default:
            return {
                icon: Bell,

                text:
                    "sent you a notification",
            };
    }
}

function NotificationsPage() {
    const navigate =
        useNavigate();

    const { user } =
        useAuth();

    const {
        currentWorkspace,
    } = useWorkspace();

    const [
        notifications,
        setNotifications,
    ] = useState([]);

    const [
        error,
        setError,
    ] = useState("");

    const [
        markingAll,
        setMarkingAll,
    ] = useState(false);

    useEffect(() => {
        const workspaceId =
            currentWorkspace?.id;

        if (
            !workspaceId ||
            !user?.uid
        ) {
            return;
        }

        const unsubscribe =
            subscribeToNotifications({
                workspaceId,

                userId:
                    user.uid,

                onData: (data) => {
                    setNotifications(
                        data
                    );

                    setError("");
                },

                onError: (error) => {
                    console.error(
                        "Notification subscription failed:",
                        error
                    );

                    setError(
                        "Unable to load notifications."
                    );
                },
            });

        return unsubscribe;
    }, [
        currentWorkspace?.id,
        user?.uid,
    ]);

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;

    async function handleNotificationClick(
        notification
    ) {
        try {
            if (
                !notification.isRead
            ) {
                await markNotificationRead(
                    notification.id
                );
            }

            if (
                notification.projectId &&
                notification.taskId
            ) {
                navigate(
                    `/app/projects/${notification.projectId}?task=${notification.taskId}`
                );

                return;
            }

            if (notification.projectId) {
                navigate(
                    `/app/projects/${notification.projectId}`
                );
            }
        } catch (error) {
            console.error(
                "Failed to open notification:",
                error
            );
        }
    }

    async function handleMarkAllRead() {
        try {
            setMarkingAll(true);

            await markAllNotificationsRead(
                notifications
            );
        } catch (error) {
            console.error(
                "Failed to mark notifications as read:",
                error
            );

            setError(
                "Unable to mark notifications as read."
            );
        } finally {
            setMarkingAll(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-heading">
                        Notifications
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        Stay updated on task assignments and collaboration.
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        variant="secondary"
                        onClick={
                            handleMarkAllRead
                        }
                        disabled={
                            markingAll
                        }
                    >
                        <CheckCheck
                            size={16}
                        />

                        {markingAll
                            ? "Marking..."
                            : "Mark all as read"}
                    </Button>
                )}
            </div>

            {error && (
                <div className="mt-6 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-6 overflow-hidden rounded-panel border border-border bg-surface">
                {notifications.length ===
                    0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-muted">
                            <Bell size={20} />
                        </div>

                        <h2 className="mt-4 text-sm font-medium text-heading">
                            You're all caught up
                        </h2>

                        <p className="mt-1 text-sm text-muted">
                            New task activity will appear here.
                        </p>
                    </div>
                ) : (
                    notifications.map(
                        (notification) => {
                            const {
                                icon: Icon,
                                text,
                            } =
                                getNotificationContent(
                                    notification
                                );

                            return (
                                <button
                                    key={
                                        notification.id
                                    }
                                    type="button"
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                    className={`
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

                    ${!notification.isRead
                                            ? "bg-indigo-50/40"
                                            : "bg-surface"
                                        }
                  `}
                                >
                                    <Avatar
                                        name={
                                            notification
                                                .actorSnapshot
                                                ?.displayName ||
                                            "User"
                                        }
                                        src={
                                            notification
                                                .actorSnapshot
                                                ?.photoURL ||
                                            null
                                        }
                                        size="md"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-5">
                                            <div>
                                                <p className="text-sm leading-5 text-body">
                                                    <span className="font-medium text-heading">
                                                        {notification
                                                            .actorSnapshot
                                                            ?.displayName ||
                                                            "User"}
                                                    </span>{" "}
                                                    {text}
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-heading">
                                                    {
                                                        notification
                                                            .metadata
                                                            ?.taskKey
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        notification
                                                            .metadata
                                                            ?.taskTitle
                                                    }
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                <span className="text-xs text-subtle">
                                                    {formatRelativeTime(
                                                        notification.createdAt
                                                    )}
                                                </span>

                                                {!notification.isRead && (
                                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center gap-1 text-xs text-muted">
                                            <Icon
                                                size={13}
                                            />

                                            {notification.type ===
                                                "task_assigned"
                                                ? "Task assignment"
                                                : "Task comment"}
                                        </div>
                                    </div>
                                </button>
                            );
                        }
                    )
                )}
            </div>
        </div>
    );
}

export default NotificationsPage;
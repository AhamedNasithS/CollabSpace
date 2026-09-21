import {
  Bell,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

import {
  subscribeToNotifications,
} from "../../services/notificationService";

function NotificationBell() {
  const { user } =
    useAuth();

  const {
    currentWorkspace,
  } = useWorkspace();

  const [
    notifications,
    setNotifications,
  ] = useState([]);

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

        onData:
          setNotifications,

        onError: (error) => {
          console.error(
            "Notification subscription failed:",
            error
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

  return (
    <Link
      to="/app/notifications"
      className="
        relative
        inline-flex
        h-9 w-9
        items-center
        justify-center
        rounded-control
        text-muted
        hover:bg-surface-muted
        hover:text-heading
      "
      aria-label="Notifications"
    >
      <Bell size={18} />

      {unreadCount > 0 && (
        <span
          className="
            absolute
            -right-1
            -top-1
            flex
            min-h-4
            min-w-4
            items-center
            justify-center
            rounded-full
            bg-primary
            px-1
            text-[10px]
            font-semibold
            leading-none
            text-white
          "
        >
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;
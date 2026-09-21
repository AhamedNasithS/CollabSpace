import {
  Activity,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  NavLink,
  useNavigate,
} from "react-router";

import Avatar from "../ui/Avatar";

import {
  ROUTES,
} from "../../constants/routes";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

const navigation = [
  {
    label: "Dashboard",
    to: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    to: ROUTES.PROJECTS,
    icon: FolderKanban,
  },
  {
    label: "My Tasks",
    to: ROUTES.MY_TASKS,
    icon: ListTodo,
  },
  {
    label: "Activity",
    to: ROUTES.ACTIVITY,
    icon: Activity,
  },
  {
    label: "Members",
    to: ROUTES.MEMBERS,
    icon: Users,
  },
];

function AppSidebar({
  mobile = false,
  onNavigate,
  onClose,
}) {
  const navigate =
    useNavigate();

  const {
    logout,
    profile,
    user,
  } = useAuth();

  const {
    currentWorkspace,
  } = useWorkspace();

  useEffect(() => {
    if (!mobile) {
      return;
    }

    function handleKeyDown(
      event
    ) {
      if (
        event.key === "Escape"
      ) {
        onClose?.();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    mobile,
    onClose,
  ]);

  async function handleLogout() {
    try {
      await logout();

      onNavigate?.();

      navigate(
        ROUTES.LOGIN,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }

  return (
    <aside
      className="
        flex
        h-full
        w-full
        flex-col
        border-r
        border-border
        bg-surface
      "
    >
      {/* Brand */}
      <div
        className="
          flex
          h-16
          shrink-0
          items-center
          justify-between
          border-b
          border-border
          px-5
        "
      >
        <span className="text-base font-semibold text-heading">
          CollabSpace
        </span>

        {mobile && (
          <button
            type="button"
            onClick={
              onClose
            }
            aria-label="Close navigation"
            className="
              inline-flex
              h-8 w-8
              items-center
              justify-center
              rounded-control
              text-muted
              transition-colors
              hover:bg-surface-muted
              hover:text-heading
              md:hidden
            "
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Current workspace */}
      <div className="shrink-0 border-b border-border p-3">
        <div
          className="
            flex
            w-full
            items-center
            rounded-control
            px-3 py-2
          "
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-heading">
              {currentWorkspace?.name ||
                "Workspace"}
            </p>

            <p className="mt-0.5 text-xs text-muted">
              Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={
                    item.to
                  }
                  to={
                    item.to
                  }
                  onClick={
                    onNavigate
                  }
                  className={({
                    isActive,
                  }) => `
                    flex
                    items-center
                    gap-3
                    rounded-control
                    px-3 py-2
                    text-sm
                    font-medium
                    transition-colors

                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-body hover:bg-surface-muted hover:text-heading"
                    }
                  `}
                >
                  <Icon
                    size={17}
                    className="shrink-0"
                  />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            }
          )}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-border p-3">
        <NavLink
          to={
            ROUTES.WORKSPACE_SETTINGS
          }
          onClick={
            onNavigate
          }
          className={({
            isActive,
          }) => `
            mb-2
            flex
            items-center
            gap-3
            rounded-control
            px-3 py-2
            text-sm
            font-medium
            transition-colors

            ${
              isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-body hover:bg-surface-muted hover:text-heading"
            }
          `}
        >
          <Settings
            size={17}
            className="shrink-0"
          />

          <span>
            Workspace Settings
          </span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to={
            ROUTES.PROFILE
          }
          onClick={
            onNavigate
          }
          className={({
            isActive,
          }) => `
            flex
            items-center
            gap-3
            rounded-control
            px-2 py-2
            transition-colors

            ${
              isActive
                ? "bg-indigo-50"
                : "hover:bg-surface-muted"
            }
          `}
        >
          <Avatar
            name={
              profile?.displayName ||
              user?.displayName ||
              user?.email ||
              "User"
            }
            src={
              profile?.photoURL ||
              user?.photoURL ||
              null
            }
            size="md"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-heading">
              {profile?.displayName ||
                user?.displayName ||
                "User"}
            </p>

            <p className="truncate text-xs text-muted">
              {profile?.jobTitle ||
                user?.email ||
                "CollabSpace user"}
            </p>
          </div>
        </NavLink>

        {/* Logout */}
        <button
          type="button"
          onClick={
            handleLogout
          }
          className="
            mt-1
            flex
            w-full
            items-center
            gap-3
            rounded-control
            px-3 py-2
            text-sm
            font-medium
            text-body
            transition-colors
            hover:bg-surface-muted
            hover:text-heading
          "
        >
          <LogOut
            size={17}
            className="shrink-0"
          />

          Log Out
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
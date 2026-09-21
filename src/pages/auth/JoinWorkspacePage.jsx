import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  Users,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import Button from "../../components/ui/Button";

import {
  ROUTES,
} from "../../constants/routes";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

import {
  acceptWorkspaceInvite,
  getWorkspaceInvite,
  isInviteValid,
} from "../../services/inviteService";

function JoinWorkspacePage() {
  const {
    inviteCode,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    user,
    profile,
    isAuthenticated,
    authLoading,
  } = useAuth();

  const {
    reloadWorkspaces,
  } = useWorkspace();

  const [
    invite,
    setInvite,
  ] = useState(null);

  const [
    inviteLoading,
    setInviteLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    isJoining,
    setIsJoining,
  ] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInvite() {
      try {
        setInviteLoading(true);
        setError("");

        const inviteData =
          await getWorkspaceInvite(
            inviteCode
          );

        if (cancelled) {
          return;
        }

        if (
          !inviteData ||
          !isInviteValid(
            inviteData
          )
        ) {
          setInvite(null);

          setError(
            "This invitation is no longer valid."
          );

          return;
        }

        setInvite(inviteData);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load invitation:",
          error
        );

        setError(
          "We couldn't load this invitation."
        );
      } finally {
        if (!cancelled) {
          setInviteLoading(false);
        }
      }
    }

    loadInvite();

    return () => {
      cancelled = true;
    };
  }, [inviteCode]);

  async function handleJoin() {
    if (
      !user ||
      !invite
    ) {
      return;
    }

    try {
      setIsJoining(true);
      setError("");

      await acceptWorkspaceInvite({
        invite,
        user,
        profile,
      });

      await reloadWorkspaces(
        invite.workspaceId
      );

      navigate(
        ROUTES.DASHBOARD,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Failed to join workspace:",
        error
      );

      setError(
        "We couldn't join this workspace. Please try again."
      );
    } finally {
      setIsJoining(false);
    }
  }

  if (
    inviteLoading ||
    authLoading
  ) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" />

        <p className="mt-3 text-sm text-muted">
          Loading invitation...
        </p>
      </div>
    );
  }

  if (
    error &&
    !invite
  ) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-danger">
          <Building2 size={20} />
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-heading">
          Invitation unavailable
        </h1>

        <p className="mt-2 text-sm text-muted">
          {error}
        </p>

        <Link
          to={
            isAuthenticated
              ? ROUTES.DASHBOARD
              : ROUTES.LOGIN
          }
          className="mt-6 block"
        >
          <Button className="w-full">
            {isAuthenticated
              ? "Go to Dashboard"
              : "Go to Sign In"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-panel border border-border bg-surface p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-panel bg-indigo-50 font-semibold text-primary">
            {invite.workspaceName
              ?.slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-heading">
              {invite.workspaceName}
            </h1>

            <p className="mt-1 text-sm leading-6 text-muted">
              You've been invited to
              collaborate with{" "}
              {invite.workspaceName} on
              CollabSpace.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-panel border border-border bg-surface-muted/60 p-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              Assigned role
            </span>

            <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
              Member
            </span>
          </div>

          {isAuthenticated ? (
            <div className="pt-4">
              <p className="text-xs text-muted">
                Joining as
              </p>

              <p className="mt-1 text-sm font-medium text-heading">
                {profile?.displayName ||
                  user?.displayName ||
                  user?.email}
              </p>

              <p className="mt-0.5 text-xs text-muted">
                {user?.email}
              </p>
            </div>
          ) : (
            <div className="pt-4">
              <Users
                size={18}
                className="text-muted"
              />

              <p className="mt-2 text-sm text-body">
                Sign in or create an
                account to accept this
                invitation.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {isAuthenticated ? (
          <Button
            className="mt-6 w-full"
            onClick={handleJoin}
            disabled={isJoining}
          >
            {isJoining
              ? "Joining..."
              : "Join Workspace"}
          </Button>
        ) : (
          <div className="mt-6 space-y-3">
            <Link
              to={`${ROUTES.LOGIN}?invite=${inviteCode}`}
              className="block"
            >
              <Button className="w-full">
                Sign In
              </Button>
            </Link>

            <Link
              to={`${ROUTES.REGISTER}?invite=${inviteCode}`}
              className="block"
            >
              <Button
                variant="secondary"
                className="w-full"
              >
                Create Account
              </Button>
            </Link>
          </div>
        )}

        <p className="mt-4 text-center text-xs leading-5 text-muted">
          After joining, you'll be
          redirected to the{" "}
          {invite.workspaceName} dashboard.
        </p>
      </div>
    </div>
  );
}

export default JoinWorkspacePage;
import {
  Crown,
  Mail,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";

import InviteWorkspaceButton from "../../components/workspace/InviteWorkspaceButton";

import useWorkspace from "../../hooks/useWorkspace";

import {
  subscribeToWorkspaceMembers,
} from "../../services/memberService";

const ROLE_LABELS = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

function getRoleIcon(role) {
  switch (role) {
    case "owner":
      return Crown;

    case "admin":
      return ShieldCheck;

    default:
      return UserRound;
  }
}

function getRoleVariant(role) {
  switch (role) {
    case "owner":
      return "warning";

    case "admin":
      return "info";

    default:
      return "default";
  }
}

function MembersPage() {
  const {
    currentWorkspace,
    currentMembership,
  } = useWorkspace();

  const [
    members,
    setMembers,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

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

  const canInvite =
    currentMembership?.role ===
      "owner" ||
    currentMembership?.role ===
      "admin";

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    const unsubscribe =
      subscribeToWorkspaceMembers({
        workspaceId,

        onData: (data) => {
          setMembers(data);
          setError("");

          setLoadedWorkspaceId(
            workspaceId
          );
        },

        onError: (error) => {
          console.error(
            "Member subscription failed:",
            error
          );

          setError(
            "Unable to load workspace members."
          );

          setLoadedWorkspaceId(
            workspaceId
          );
        },
      });

    return unsubscribe;
  }, [workspaceId]);

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const visibleMembers =
    normalizedSearch
      ? members.filter(
          (member) => {
            const name =
              member.profile
                ?.displayName ||
              "";

            const email =
              member.profile
                ?.email ||
              "";

            return (
              name
                .toLowerCase()
                .includes(
                  normalizedSearch
                ) ||
              email
                .toLowerCase()
                .includes(
                  normalizedSearch
                )
            );
          }
        )
      : members;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-heading">
            Members
          </h1>

          <p className="mt-1 text-sm text-muted">
            Manage people collaborating
            in{" "}
            {currentWorkspace?.name ||
              "your workspace"}.
          </p>
        </div>

        {canInvite && (
          <InviteWorkspaceButton />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Users size={16} />

          <span>
            {members.length}{" "}
            {members.length === 1
              ? "member"
              : "members"}
          </span>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search members..."
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
          Loading members...
        </div>
      ) : visibleMembers.length ===
        0 ? (
        <div className="mt-6 rounded-panel border border-border bg-surface px-6 py-16 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-muted">
            <Users size={20} />
          </div>

          <h2 className="mt-4 text-sm font-medium text-heading">
            No members found
          </h2>

          <p className="mt-1 text-sm text-muted">
            {members.length === 0
              ? "Your workspace doesn't have any members yet."
              : "No members match your search."}
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-panel border border-border bg-surface">
          {visibleMembers.map(
            (member) => {
              const RoleIcon =
                getRoleIcon(
                  member.role
                );

              const displayName =
                member.profile
                  ?.displayName ||
                "Workspace member";

              const email =
                member.profile
                  ?.email ||
                "";

              return (
                <div
                  key={member.id}
                  className="
                    flex
                    items-center
                    gap-4
                    border-b
                    border-border
                    px-5 py-4
                    last:border-b-0
                  "
                >
                  <Avatar
                    name={
                      displayName
                    }
                    src={
                      member.profile
                        ?.photoURL ||
                      null
                    }
                    size="md"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-heading">
                        {displayName}
                      </p>

                      <Badge
                        variant={getRoleVariant(
                          member.role
                        )}
                      >
                        <span className="inline-flex items-center gap-1">
                          <RoleIcon
                            size={11}
                          />

                          {ROLE_LABELS[
                            member.role
                          ] ||
                            member.role}
                        </span>
                      </Badge>
                    </div>

                    {email && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                        <Mail
                          size={12}
                        />

                        <span className="truncate">
                          {email}
                        </span>
                      </div>
                    )}
                  </div>

                  {member.profile
                    ?.jobTitle && (
                    <p className="hidden text-sm text-muted sm:block">
                      {
                        member.profile
                          .jobTitle
                      }
                    </p>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default MembersPage;
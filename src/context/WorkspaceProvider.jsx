import {
  useEffect,
  useState,
} from "react";

import WorkspaceContext from "./WorkspaceContext";

import useAuth from "../hooks/useAuth";

import {
  createWorkspace as createWorkspaceService,
  getUserMemberships,
  getWorkspace,
} from "../services/workspaceService";

import {
  updateUserProfile,
} from "../services/userService";

async function fetchWorkspaceEntries(userId) {
  const memberships =
    await getUserMemberships(userId);

  const entries = await Promise.all(
    memberships.map(async (membership) => {
      const workspace =
        await getWorkspace(
          membership.workspaceId
        );

      if (
        !workspace ||
        workspace.deletedAt
      ) {
        return null;
      }

      return {
        workspace,
        membership,
      };
    })
  );

  return entries.filter(Boolean);
}

function getSelectedEntry(
  entries,
  preferredWorkspaceId
) {
  if (entries.length === 0) {
    return null;
  }

  return (
    entries.find(
      ({ workspace }) =>
        workspace.id ===
        preferredWorkspaceId
    ) ||
    entries[0]
  );
}

function WorkspaceProvider({
  children,
}) {
  const {
    user,
    profile,
    authLoading,
  } = useAuth();

  const userId = user?.uid || null;

  const [
    workspaceEntries,
    setWorkspaceEntries,
  ] = useState([]);

  const [
    currentWorkspaceState,
    setCurrentWorkspaceState,
  ] = useState(null);

  const [
    currentMembershipState,
    setCurrentMembershipState,
  ] = useState(null);

  const [
    loadedUserId,
    setLoadedUserId,
  ] = useState(null);

  const [
    workspaceError,
    setWorkspaceError,
  ] = useState("");

  useEffect(() => {
    if (
      authLoading ||
      !userId
    ) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const entries =
          await fetchWorkspaceEntries(
            userId
          );

        if (cancelled) {
          return;
        }

        const selectedEntry =
          getSelectedEntry(
            entries,
            profile?.lastWorkspaceId
          );

        setWorkspaceEntries(
          entries
        );

        setCurrentWorkspaceState(
          selectedEntry?.workspace ||
            null
        );

        setCurrentMembershipState(
          selectedEntry?.membership ||
            null
        );

        setWorkspaceError("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load workspaces:",
          error
        );

        setWorkspaceEntries([]);

        setCurrentWorkspaceState(
          null
        );

        setCurrentMembershipState(
          null
        );

        setWorkspaceError(
          "Unable to load your workspaces."
        );
      } finally {
        if (!cancelled) {
          setLoadedUserId(
            userId
          );
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    userId,
    profile?.lastWorkspaceId,
  ]);

  async function reloadWorkspaces(
    preferredWorkspaceId = null
  ) {
    if (!userId) {
      return [];
    }

    try {
      const entries =
        await fetchWorkspaceEntries(
          userId
        );

      const selectedEntry =
        getSelectedEntry(
          entries,
          preferredWorkspaceId ||
            profile?.lastWorkspaceId
        );

      setWorkspaceEntries(
        entries
      );

      setCurrentWorkspaceState(
        selectedEntry?.workspace ||
          null
      );

      setCurrentMembershipState(
        selectedEntry?.membership ||
          null
      );

      setWorkspaceError("");

      return entries;
    } catch (error) {
      console.error(
        "Failed to reload workspaces:",
        error
      );

      setWorkspaceError(
        "Unable to load your workspaces."
      );

      throw error;
    } finally {
      setLoadedUserId(
        userId
      );
    }
  }

  async function createWorkspace({
    name,
    description,
  }) {
    if (!user) {
      throw new Error(
        "You must be signed in."
      );
    }

    const workspaceId =
      await createWorkspaceService({
        name,
        description,
        user,
        profile,
      });

    await reloadWorkspaces(
      workspaceId
    );

    return workspaceId;
  }

  async function switchWorkspace(
    workspaceId
  ) {
    const selectedEntry =
      workspaceEntries.find(
        ({ workspace }) =>
          workspace.id ===
          workspaceId
      );

    if (!selectedEntry) {
      return;
    }

    setCurrentWorkspaceState(
      selectedEntry.workspace
    );

    setCurrentMembershipState(
      selectedEntry.membership
    );

    await updateUserProfile(
      userId,
      {
        lastWorkspaceId:
          workspaceId,
      }
    );
  }

  const workspaceLoading =
    authLoading ||
    Boolean(
      userId &&
        loadedUserId !== userId
    );

  const workspaces = userId
    ? workspaceEntries.map(
        ({ workspace }) =>
          workspace
      )
    : [];

  const currentWorkspace =
    userId
      ? currentWorkspaceState
      : null;

  const currentMembership =
    userId
      ? currentMembershipState
      : null;

  const hasWorkspace =
    workspaces.length > 0;

  const value = {
    workspaces,

    currentWorkspace,
    currentMembership,

    workspaceLoading,

    workspaceError:
      workspaceLoading
        ? ""
        : workspaceError,

    hasWorkspace,

    createWorkspace,
    switchWorkspace,
    reloadWorkspaces,
  };

  return (
    <WorkspaceContext.Provider
      value={value}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export default WorkspaceProvider;
import {
  useState,
} from "react";

import {
  Check,
  Copy,
  UserPlus,
} from "lucide-react";

import Button from "../ui/Button";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

import {
  createWorkspaceInvite,
} from "../../services/inviteService";

function InviteWorkspaceButton() {
  const { user } = useAuth();

  const {
    currentWorkspace,
    currentMembership,
  } = useWorkspace();

  const [
    inviteUrl,
    setInviteUrl,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    isCreating,
    setIsCreating,
  ] = useState(false);

  const canInvite =
    currentMembership?.role ===
      "owner" ||
    currentMembership?.role ===
      "admin";

  async function handleCreateInvite() {
    if (
      !canInvite ||
      !currentWorkspace ||
      !user
    ) {
      return;
    }

    try {
      setIsCreating(true);

      const token =
        await createWorkspaceInvite({
          workspace:
            currentWorkspace,

          userId:
            user.uid,
        });

      const url =
        `${window.location.origin}/join/${token}`;

      setInviteUrl(url);
      setCopied(false);
    } catch (error) {
      console.error(
        "Failed to create invite:",
        error
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleCopy() {
    if (!inviteUrl) {
      return;
    }

    await navigator.clipboard.writeText(
      inviteUrl
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  if (!canInvite) {
    return null;
  }

  return (
    <div>
      {!inviteUrl ? (
        <Button
          onClick={
            handleCreateInvite
          }
          disabled={isCreating}
        >
          <UserPlus size={16} />

          {isCreating
            ? "Creating..."
            : "Create Invite Link"}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={inviteUrl}
            className="h-10 min-w-0 flex-1 rounded-control border border-border bg-surface px-3 text-sm text-heading"
          />

          <Button
            variant="secondary"
            onClick={handleCopy}
          >
            {copied ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}

            {copied
              ? "Copied"
              : "Copy"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default InviteWorkspaceButton;
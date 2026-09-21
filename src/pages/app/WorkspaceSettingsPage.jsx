import {
  Building2,
  ShieldCheck,
} from "lucide-react";

import {
  useState,
} from "react";

import Button from "../../components/ui/Button";

import useWorkspace from "../../hooks/useWorkspace";

import {
  updateWorkspace,
} from "../../services/workspaceService";

function WorkspaceSettingsForm({
  workspace,
  membership,
  reloadWorkspaces,
}) {
  const [name, setName] =
    useState(
      workspace.name || ""
    );

  const [
    description,
    setDescription,
  ] = useState(
    workspace.description || ""
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const canManage =
    membership?.role ===
      "owner" ||
    membership?.role ===
      "admin";

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setError(
        "Workspace name is required."
      );

      return;
    }

    try {
      setIsSaving(true);

      setError("");
      setSuccess("");

      await updateWorkspace({
        workspaceId:
          workspace.id,

        name:
          trimmedName,

        description,
      });

      await reloadWorkspaces();

      setSuccess(
        "Workspace settings updated."
      );
    } catch (error) {
      console.error(
        "Workspace update failed:",
        error
      );

      setError(
        "We couldn't update the workspace."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-panel border border-border bg-surface">
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-control bg-indigo-50 text-primary">
            <Building2
              size={18}
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-heading">
              General
            </h2>

            <p className="mt-0.5 text-xs text-muted">
              Basic workspace information.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6"
      >
        {error && (
          <div className="mb-5 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-control border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-heading">
            Workspace name
          </label>

          <input
            value={name}
            disabled={
              !canManage ||
              isSaving
            }
            maxLength={80}
            onChange={(event) => {
              setName(
                event.target.value
              );

              setError("");
              setSuccess("");
            }}
            className="
              h-10 w-full
              rounded-control
              border border-border
              bg-surface
              px-3
              text-sm text-heading
              outline-none
              disabled:cursor-not-allowed
              disabled:bg-surface-muted
              disabled:text-muted
              focus:border-primary
              focus:ring-2
              focus:ring-primary/15
            "
          />
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-heading">
            Description
          </label>

          <textarea
            rows={4}
            value={description}
            disabled={
              !canManage ||
              isSaving
            }
            maxLength={300}
            onChange={(event) => {
              setDescription(
                event.target.value
              );

              setSuccess("");
            }}
            placeholder="What does this workspace work on?"
            className="
              w-full resize-none
              rounded-control
              border border-border
              bg-surface
              px-3 py-3
              text-sm text-heading
              outline-none
              placeholder:text-subtle
              disabled:cursor-not-allowed
              disabled:bg-surface-muted
              disabled:text-muted
              focus:border-primary
              focus:ring-2
              focus:ring-primary/15
            "
          />

          <p className="mt-1.5 text-xs text-muted">
            {description.length}/300
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <div className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck
              size={14}
            />

            Your role:{" "}

            <span className="font-medium capitalize text-heading">
              {membership?.role ||
                "member"}
            </span>
          </div>

          {canManage && (
            <Button
              type="submit"
              disabled={
                isSaving ||
                !name.trim()
              }
            >
              {isSaving
                ? "Saving..."
                : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function WorkspaceSettingsPage() {
  const {
    currentWorkspace,
    currentMembership,
    reloadWorkspaces,
  } = useWorkspace();

  if (!currentWorkspace) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Workspace Settings
        </h1>

        <p className="mt-1 text-sm text-muted">
          Manage general settings for{" "}
          {currentWorkspace.name}.
        </p>
      </div>

      <div className="mt-6">
        <WorkspaceSettingsForm
          key={
            currentWorkspace.id
          }
          workspace={
            currentWorkspace
          }
          membership={
            currentMembership
          }
          reloadWorkspaces={
            reloadWorkspaces
          }
        />
      </div>

      {currentMembership?.role !==
        "owner" &&
        currentMembership?.role !==
          "admin" && (
          <div className="mt-5 rounded-control border border-border bg-surface-muted px-4 py-3 text-sm text-muted">
            Only workspace owners and administrators can change workspace settings.
          </div>
        )}
    </div>
  );
}

export default WorkspaceSettingsPage;
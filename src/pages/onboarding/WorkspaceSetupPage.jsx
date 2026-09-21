import { useState } from "react";
import {
  Building2,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { ROUTES } from "../../constants/routes";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

function WorkspaceSetupPage() {
  const navigate =
    useNavigate();

  const {
    user,
    profile,
  } = useAuth();

  const {
    createWorkspace,
  } = useWorkspace();

  const [name, setName] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    nameError,
    setNameError,
  ] = useState("");

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setSubmitError("");

    if (!name.trim()) {
      setNameError(
        "Enter a workspace name."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await createWorkspace({
        name: name.trim(),
        description:
          description.trim(),
      });

      navigate(
        ROUTES.DASHBOARD,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Workspace creation failed:",
        error
      );

      setSubmitError(
        "We couldn't create your workspace. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-panel bg-indigo-50 text-primary">
          <Building2
            size={22}
          />
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-heading">
          Welcome to CollabSpace
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted">
          Create a workspace for your
          team or join one you've been
          invited to.
        </p>

        <p className="mt-3 text-xs text-subtle">
          Signed in as{" "}
          <span className="font-medium text-muted">
            {profile?.displayName ||
              user?.displayName ||
              user?.email}
          </span>
        </p>
      </div>

      <div className="rounded-panel border border-border bg-surface p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-heading">
            Create your workspace
          </h2>

          <p className="mt-1 text-sm text-muted">
            Workspaces organize your
            projects, tasks, and team
            members.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          {submitError && (
            <div
              role="alert"
              className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {submitError}
            </div>
          )}

          <Input
            id="workspaceName"
            label="Workspace name"
            placeholder="PixelForge Team"
            value={name}
            onChange={(
              event
            ) => {
              setName(
                event.target.value
              );

              setNameError("");
              setSubmitError("");
            }}
            error={nameError}
            disabled={
              isSubmitting
            }
          />

          <div>
            <label
              htmlFor="workspaceDescription"
              className="mb-1.5 block text-sm font-medium text-heading"
            >
              Workspace description
              <span className="ml-1 font-normal text-subtle">
                Optional
              </span>
            </label>

            <textarea
              id="workspaceDescription"
              rows={3}
              placeholder="Product and engineering workspace for our team."
              value={description}
              onChange={(
                event
              ) =>
                setDescription(
                  event.target.value
                )
              }
              disabled={
                isSubmitting
              }
              className="
                w-full resize-none
                rounded-control
                border border-border
                bg-surface
                px-3 py-2.5
                text-sm text-heading
                outline-none
                transition
                placeholder:text-subtle
                focus:border-primary
                focus:ring-2
                focus:ring-primary/15
                disabled:bg-surface-muted
              "
            />
          </div>

          <div className="rounded-control bg-surface-muted px-4 py-3">
            <p className="text-sm text-body">
              You'll become the{" "}
              <span className="font-medium text-heading">
                Owner
              </span>{" "}
              of this workspace.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting
            }
          >
            {isSubmitting
              ? "Creating workspace..."
              : "Create Workspace"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs text-muted">
            or
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="text-center">
          <Users
            size={19}
            className="mx-auto text-muted"
          />

          <p className="mt-2 text-sm font-medium text-heading">
            Already have an invitation?
          </p>

          <p className="mt-1 text-xs text-muted">
            Join a workspace using an
            invitation link.
          </p>

          <Button
            variant="secondary"
            className="mt-4 w-full"
            disabled
          >
            Join Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceSetupPage;
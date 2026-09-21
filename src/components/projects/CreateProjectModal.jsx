import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

import {
  createProject,
  projectCodeExists,
} from "../../services/projectService";

function normalizeCode(value) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 5);
}

function CreateProjectModal({
  open,
  onClose,
  onCreated,
}) {
  const { user } = useAuth();

  const {
    currentWorkspace,
  } = useWorkspace();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [submitError, setSubmitError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function resetForm() {
    setName("");
    setCode("");
    setDescription("");
    setErrors({});
    setSubmitError("");
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  }

  function validate() {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name =
        "Enter a project name.";
    }

    if (!code.trim()) {
      nextErrors.code =
        "Enter a project code.";
    } else if (
      code.length < 2 ||
      code.length > 5
    ) {
      nextErrors.code =
        "Use 2–5 letters or numbers.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitError("");

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const normalizedCode =
        normalizeCode(code);

      const exists =
        await projectCodeExists({
          workspaceId:
            currentWorkspace.id,

          code:
            normalizedCode,
        });

      if (exists) {
        setErrors((current) => ({
          ...current,
          code:
            "This project code is already in use.",
        }));

        return;
      }

      const projectId =
        await createProject({
          workspaceId:
            currentWorkspace.id,

          userId:
            user.uid,

          name:
            name.trim(),

          description:
            description.trim(),

          code:
            normalizedCode,
        });

      resetForm();

      onClose();

      await onCreated?.(
        projectId
      );
    } catch (error) {
      console.error(
        "Project creation failed:",
        error
      );

      setSubmitError(
        "We couldn't create the project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create project"
      description="Create a project inside your current workspace."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {submitError && (
          <div
            role="alert"
            className="
              rounded-control
              border border-red-200
              bg-red-50
              px-4 py-3
              text-sm text-red-700
            "
          >
            {submitError}
          </div>
        )}

        <Input
          id="projectName"
          label="Project name"
          placeholder="Website Redesign"
          value={name}
          onChange={(event) => {
            setName(event.target.value);

            setErrors((current) => ({
              ...current,
              name: "",
            }));
          }}
          error={errors.name}
          disabled={isSubmitting}
        />

        <Input
          id="projectCode"
          label="Project code"
          placeholder="WEB"
          value={code}
          maxLength={5}
          onChange={(event) => {
            setCode(
              normalizeCode(
                event.target.value
              )
            );

            setErrors((current) => ({
              ...current,
              code: "",
            }));
          }}
          error={errors.code}
          helperText="Used for task IDs such as WEB-24."
          disabled={isSubmitting}
        />

        <div>
          <label
            htmlFor="projectDescription"
            className="mb-1.5 block text-sm font-medium text-heading"
          >
            Description
            <span className="ml-1 font-normal text-subtle">
              Optional
            </span>
          </label>

          <textarea
            id="projectDescription"
            rows={4}
            placeholder="Marketing website overhaul and interactive component system."
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            disabled={isSubmitting}
            className="
              w-full resize-none
              rounded-control
              border border-border
              bg-surface
              px-3 py-2.5
              text-sm text-heading
              outline-none
              placeholder:text-subtle
              focus:border-primary
              focus:ring-2
              focus:ring-primary/15
              disabled:bg-surface-muted
            "
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating..."
              : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;
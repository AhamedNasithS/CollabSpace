import { useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

import {
    createTask,
} from "../../services/taskService";

function CreateTaskModal({
    onClose,
    project,
    initialStatus = "backlog",
}) {
    const {
        user,
        profile,
    } = useAuth();

    const {
        currentWorkspace,
    } = useWorkspace();

    const [title, setTitle] =
        useState("");

    const [
        description,
        setDescription,
    ] = useState("");

    const [status, setStatus] =
        useState(initialStatus);

    const [priority, setPriority] =
        useState("medium");

    const [assignee, setAssignee] =
        useState("me");

    const [dueDate, setDueDate] =
        useState("");

    const [titleError, setTitleError] =
        useState("");

    const [
        submitError,
        setSubmitError,
    ] = useState("");

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    function resetForm() {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setAssignee("me");
        setDueDate("");
        setTitleError("");
        setSubmitError("");
    }

    function handleClose() {
        if (isSubmitting) {
            return;
        }

        resetForm();
        onClose();
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!title.trim()) {
            setTitleError(
                "Enter a task title."
            );

            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError("");

            await createTask({
                workspaceId:
                    currentWorkspace.id,

                projectId:
                    project.id,

                userId:
                    user.uid,

                actorName:
                    profile?.displayName ||
                    user.displayName ||
                    user.email,

                actorPhotoURL:
                    profile?.photoURL ||
                    user.photoURL ||
                    null,

                title:
                    title.trim(),

                description:
                    description.trim(),

                status,
                priority,

                assigneeId:
                    assignee === "me"
                        ? user.uid
                        : null,

                dueDate,
            });

            resetForm();
            onClose();
        } catch (error) {
            console.error(
                "Task creation failed:",
                error
            );

            setSubmitError(
                "We couldn't create the task. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal
            open
            onClose={handleClose}
            title="Create task"
            description={`Add a task to ${project?.name || "this project"}.`}
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {submitError && (
                    <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                    </div>
                )}

                <Input
                    id="taskTitle"
                    label="Task title"
                    placeholder="Implement responsive navigation"
                    value={title}
                    onChange={(event) => {
                        setTitle(
                            event.target.value
                        );
                        setTitleError("");
                    }}
                    error={titleError}
                    disabled={isSubmitting}
                />

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-heading">
                        Description
                    </label>

                    <textarea
                        rows={4}
                        value={description}
                        onChange={(event) =>
                            setDescription(
                                event.target.value
                            )
                        }
                        placeholder="Describe the task..."
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
            "
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-heading">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                            className="h-10 w-full rounded-control border border-border bg-surface px-3 text-sm text-heading outline-none focus:border-primary"
                        >
                            <option value="backlog">
                                Backlog
                            </option>

                            <option value="todo">
                                To Do
                            </option>

                            <option value="in_progress">
                                In Progress
                            </option>

                            <option value="review">
                                Review
                            </option>

                            <option value="completed">
                                Completed
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-heading">
                            Priority
                        </label>

                        <select
                            value={priority}
                            onChange={(event) =>
                                setPriority(
                                    event.target.value
                                )
                            }
                            className="h-10 w-full rounded-control border border-border bg-surface px-3 text-sm text-heading outline-none focus:border-primary"
                        >
                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>

                            <option value="urgent">
                                Urgent
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-heading">
                            Assignee
                        </label>

                        <select
                            value={assignee}
                            onChange={(event) =>
                                setAssignee(
                                    event.target.value
                                )
                            }
                            className="h-10 w-full rounded-control border border-border bg-surface px-3 text-sm text-heading outline-none focus:border-primary"
                        >
                            <option value="me">
                                Assign to me
                            </option>

                            <option value="none">
                                Unassigned
                            </option>
                        </select>
                    </div>

                    <Input
                        id="dueDate"
                        type="date"
                        label="Due date"
                        value={dueDate}
                        onChange={(event) =>
                            setDueDate(
                                event.target.value
                            )
                        }
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
                            : "Create Task"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default CreateTaskModal;
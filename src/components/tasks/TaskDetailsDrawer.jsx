import {
    CalendarDays,
    CheckCircle2,
    Flag,
    Tag,
    UserRound,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import Button from "../ui/Button";

import {
    TASK_PRIORITY,
    TASK_PRIORITY_LABELS,
} from "../../constants/priorities";

import {
    TASK_STATUS,
    TASK_STATUS_LABELS,
} from "../../constants/taskStatus";

import useWorkspace from "../../hooks/useWorkspace";

import {
    subscribeToWorkspaceMembers,
} from "../../services/memberService";

import {
    updateTaskDetails,
} from "../../services/taskService";
import TaskActivity from "./TaskActivity";
import TaskComments from "./TaskComments";
import useAuth from "../../hooks/useAuth";

function timestampToInputDate(
    timestamp
) {
    if (!timestamp?.toDate) {
        return "";
    }

    const date = timestamp.toDate();

    const year =
        date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function TaskDetailsDrawer({
    task,
    projectName,
    onClose,
}) {
    const {
        currentWorkspace,
    } = useWorkspace();

    const {
        user,
        profile,
    } = useAuth();

    const [title, setTitle] =
        useState(task.title || "");

    const [
        description,
        setDescription,
    ] = useState(
        task.description || ""
    );

    const [status, setStatus] =
        useState(task.status);

    const [priority, setPriority] =
        useState(task.priority);

    const [
        assigneeId,
        setAssigneeId,
    ] = useState(
        task.assigneeId || ""
    );

    const [dueDate, setDueDate] =
        useState(
            timestampToInputDate(
                task.dueAt
            )
        );

    const [labels, setLabels] =
        useState(
            (task.labels || []).join(", ")
        );

    const [members, setMembers] =
        useState([]);

    const [
        membersError,
        setMembersError,
    ] = useState("");

    const [
        submitError,
        setSubmitError,
    ] = useState("");

    const [
        titleError,
        setTitleError,
    ] = useState("");

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        activeTab,
        setActiveTab,
    ] = useState("comments");

    useEffect(() => {
        const workspaceId =
            currentWorkspace?.id;

        if (!workspaceId) {
            return;
        }

        const unsubscribe =
            subscribeToWorkspaceMembers({
                workspaceId,

                onData: (data) => {
                    setMembers(data);
                    setMembersError("");
                },

                onError: (error) => {
                    console.error(
                        "Member subscription failed:",
                        error
                    );

                    setMembersError(
                        "Unable to load workspace members."
                    );
                },
            });

        return unsubscribe;
    }, [
        currentWorkspace?.id,
    ]);

    useEffect(() => {
        function handleKeyDown(
            event
        ) {
            if (
                event.key === "Escape"
            ) {
                onClose();
            }
        }

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        document.body.style.overflow =
            "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                "";
        };
    }, [onClose]);

    async function handleSave(
        event
    ) {
        event.preventDefault();

        if (!title.trim()) {
            setTitleError(
                "Enter a task title."
            );

            return;
        }

        try {
            setIsSaving(true);
            setSubmitError("");

            const parsedLabels =
                labels
                    .split(",")
                    .map((label) =>
                        label.trim()
                    )
                    .filter(Boolean)
                    .slice(0, 5);

            await updateTaskDetails({
                taskId:
                    task.id,

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
                    assigneeId || null,

                dueDate,

                labels:
                    parsedLabels,
            });

            onClose();
        } catch (error) {
            console.error(
                "Task update failed:",
                error
            );

            setSubmitError(
                "We couldn't update the task. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50">
            <button
                type="button"
                aria-label="Close task details"
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/25"
            />

            <aside
                className="
  absolute
  right-0
  top-0
  flex
  h-full
  w-full
  flex-col
  border-l
  border-border
  bg-surface
  shadow-floating
  sm:max-w-xl
"
            >
                <header className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex min-w-0 items-center gap-2">
                        <CheckCircle2
                            size={16}
                            className="shrink-0 text-primary"
                        />

                        <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                            {task.key}
                        </span>

                        <span className="text-muted">
                            /
                        </span>

                        <span className="truncate text-sm text-muted">
                            {projectName}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-control p-2 text-muted hover:bg-surface-muted hover:text-heading"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </header>

                <form
                    onSubmit={handleSave}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        {submitError && (
                            <div className="mb-5 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {submitError}
                            </div>
                        )}

                        <div>
                            <input
                                value={title}
                                onChange={(event) => {
                                    setTitle(
                                        event.target.value
                                    );

                                    setTitleError("");
                                }}
                                className="
                  w-full
                  border-0
                  bg-transparent
                  p-0
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-heading
                  outline-none
                "
                            />

                            {titleError && (
                                <p className="mt-1 text-xs text-danger">
                                    {titleError}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 rounded-panel border border-border bg-slate-50/50 p-4">
                            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                                        <CheckCircle2
                                            size={13}
                                        />
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
                                        {Object.values(
                                            TASK_STATUS
                                        ).map(
                                            (value) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {
                                                        TASK_STATUS_LABELS[
                                                        value
                                                        ]
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                                        <Flag size={13} />
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
                                        {Object.values(
                                            TASK_PRIORITY
                                        ).map(
                                            (value) => (
                                                <option
                                                    key={value}
                                                    value={value}
                                                >
                                                    {
                                                        TASK_PRIORITY_LABELS[
                                                        value
                                                        ]
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                                        <UserRound
                                            size={13}
                                        />
                                        Assignee
                                    </label>

                                    <select
                                        value={assigneeId}
                                        onChange={(event) =>
                                            setAssigneeId(
                                                event.target.value
                                            )
                                        }
                                        className="h-10 w-full rounded-control border border-border bg-surface px-3 text-sm text-heading outline-none focus:border-primary"
                                    >
                                        <option value="">
                                            Unassigned
                                        </option>

                                        {members.map(
                                            (member) => (
                                                <option
                                                    key={
                                                        member.userId
                                                    }
                                                    value={
                                                        member.userId
                                                    }
                                                >
                                                    {member.profile
                                                        ?.displayName ||
                                                        member.profile
                                                            ?.email ||
                                                        "Workspace member"}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {membersError && (
                                        <p className="mt-1 text-xs text-danger">
                                            {membersError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                                        <CalendarDays
                                            size={13}
                                        />
                                        Due date
                                    </label>

                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(event) =>
                                            setDueDate(
                                                event.target.value
                                            )
                                        }
                                        className="h-10 w-full rounded-control border border-border bg-surface px-3 text-sm text-heading outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">
                                Description
                            </label>

                            <textarea
                                rows={6}
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Add a description..."
                                className="
                  w-full resize-none
                  rounded-control
                  border border-border
                  bg-surface
                  px-3 py-3
                  text-sm leading-6
                  text-heading
                  outline-none
                  placeholder:text-subtle
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/15
                "
                            />
                        </div>

                        <div className="mt-6">
                            <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                                <Tag size={13} />
                                Labels
                            </label>

                            <input
                                value={labels}
                                onChange={(event) =>
                                    setLabels(
                                        event.target.value
                                    )
                                }
                                placeholder="Frontend, Responsive"
                                className="
                  h-10 w-full
                  rounded-control
                  border border-border
                  bg-surface
                  px-3
                  text-sm text-heading
                  outline-none
                  placeholder:text-subtle
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/15
                "
                            />

                            <p className="mt-1.5 text-xs text-muted">
                                Separate labels with commas. Maximum 5.
                            </p>
                        </div>

                        <div className="mt-8 border-t border-border pt-5">
                            <div className="flex items-center gap-6 border-b border-border">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            "comments"
                                        )
                                    }
                                    className={`
        -mb-px
        border-b-2
        pb-3
        text-sm
        font-medium

        ${activeTab ===
                                            "comments"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted hover:text-heading"
                                        }
      `}
                                >
                                    Comments{" "}

                                    {task.commentCount >
                                        0 && (
                                            <span className="ml-1">
                                                {task.commentCount}
                                            </span>
                                        )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            "activity"
                                        )
                                    }
                                    className={`
        -mb-px
        border-b-2
        pb-3
        text-sm
        font-medium

        ${activeTab ===
                                            "activity"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted hover:text-heading"
                                        }
      `}
                                >
                                    Activity
                                </button>
                            </div>

                            <div className="mt-5">
                                {activeTab ===
                                    "comments" ? (
                                    <TaskComments
                                        task={task}
                                    />
                                ) : (
                                    <TaskActivity
                                        task={task}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <footer className="flex items-center justify-end gap-2 border-t border-border bg-surface px-6 py-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSaving}
                        >
                            {isSaving
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </footer>
                </form>
            </aside>
        </div>
    );
}

export default TaskDetailsDrawer;
import {
    Plus,
    Search,
} from "lucide-react";

import {
    useEffect,
    useState,
    useRef,
} from "react";

import {
    useParams,
    useSearchParams,
} from "react-router";

import BoardColumn from "../../components/board/BoardColumn";
import Button from "../../components/ui/Button";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import TaskDetailsDrawer from "../../components/tasks/TaskDetailsDrawer";

import {
    DndContext,
    PointerSensor,
    pointerWithin,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    TASK_STATUS,
    TASK_STATUS_LABELS,
} from "../../constants/taskStatus";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

import {
    getProject,
} from "../../services/projectService";

import {
    subscribeToProjectTasks,
    updateTaskStatus,
} from "../../services/taskService";

const BOARD_STATUSES = [
    TASK_STATUS.BACKLOG,
    TASK_STATUS.TODO,
    TASK_STATUS.IN_PROGRESS,
    TASK_STATUS.REVIEW,
    TASK_STATUS.COMPLETED,
];

function ProjectBoardPage() {
    const { projectId } =
        useParams();

    const {
        user,
        profile,
    } = useAuth();

    const {
        currentWorkspace,
    } = useWorkspace();

    const [project, setProject] =
        useState(null);

    const [tasks, setTasks] =
        useState([]);

    const [
        loadedProjectId,
        setLoadedProjectId,
    ] = useState(null);

    const [
        projectError,
        setProjectError,
    ] = useState("");

    const [
        taskError,
        setTaskError,
    ] = useState("");

    const [
        createTaskOpen,
        setCreateTaskOpen,
    ] = useState(false);

    const [
        createTaskStatus,
        setCreateTaskStatus,
    ] = useState(
        TASK_STATUS.BACKLOG
    );

    const [search, setSearch] =
        useState("");

    const lastOverStatusRef = useRef(null);

    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();


    const selectedTaskId =
        searchParams.get("task");

    const selectedTask =
        tasks.find(
            (task) =>
                task.id === selectedTaskId
        ) || null;

    const projectLoading =
        loadedProjectId !==
        projectId;

    const sensors = useSensors(
        useSensor(
            PointerSensor,
            {
                activationConstraint: {
                    distance: 6,
                },
            }
        )
    );

    function openTaskDetails(task) {
        const nextParams =
            new URLSearchParams(
                searchParams
            );

        nextParams.set(
            "task",
            task.id
        );

        setSearchParams(
            nextParams
        );
    }

    function closeTaskDetails() {
        const nextParams =
            new URLSearchParams(
                searchParams
            );

        nextParams.delete(
            "task"
        );

        setSearchParams(
            nextParams,
            {
                replace: true,
            }
        );
    }

    function handleDragOver(event) {
        const { over } = event;

        if (!over) {
            return;
        }

        const status =
            over.data.current?.status ||
            String(over.id);

        if (
            BOARD_STATUSES.includes(status)
        ) {
            lastOverStatusRef.current =
                status;
        }
    }

    async function handleDragEnd(event) {
        const { active, over } = event;

        const taskId = String(active.id);

        const detectedStatus =
            over?.data.current?.status ||
            (over ? String(over.id) : null);

        const newStatus =
            BOARD_STATUSES.includes(
                detectedStatus
            )
                ? detectedStatus
                : lastOverStatusRef.current;

        lastOverStatusRef.current = null;

        if (
            !newStatus ||
            !BOARD_STATUSES.includes(
                newStatus
            )
        ) {
            return;
        }

        const task = tasks.find(
            (item) => item.id === taskId
        );

        if (!task) {
            return;
        }

        if (
            task.status === newStatus
        ) {
            return;
        }

        const previousStatus =
            task.status;

        setTaskError("");

        setTasks((current) =>
            current.map((item) =>
                item.id === taskId
                    ? {
                        ...item,
                        status: newStatus,
                    }
                    : item
            )
        );

        try {
            await updateTaskStatus({
                taskId,
                status: newStatus,

                userId: user.uid,

                actorName:
                    profile?.displayName ||
                    user.displayName ||
                    user.email ||
                    "User",

                actorPhotoURL:
                    profile?.photoURL ||
                    user.photoURL ||
                    null,
            });
        } catch (error) {
            console.error(
                "Failed to move task:",
                error
            );

            setTasks((current) =>
                current.map((item) =>
                    item.id === taskId
                        ? {
                            ...item,
                            status: previousStatus,
                        }
                        : item
                )
            );

            setTaskError(
                "We couldn't move the task. Please try again."
            );
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function loadProject() {
            try {
                const data =
                    await getProject(
                        projectId
                    );

                if (cancelled) {
                    return;
                }

                if (
                    !data ||
                    data.workspaceId !==
                    currentWorkspace?.id
                ) {
                    setProject(null);

                    setProjectError(
                        "Project not found."
                    );

                    return;
                }

                setProject(data);
                setProjectError("");
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load project:",
                    error
                );

                setProjectError(
                    "Unable to load project."
                );
            } finally {
                if (!cancelled) {
                    setLoadedProjectId(
                        projectId
                    );
                }
            }
        }

        loadProject();

        return () => {
            cancelled = true;
        };
    }, [
        projectId,
        currentWorkspace?.id,
    ]);

    useEffect(() => {
        const workspaceId =
            currentWorkspace?.id;

        if (
            !workspaceId ||
            !projectId
        ) {
            return;
        }

        const unsubscribe =
            subscribeToProjectTasks({
                workspaceId,
                projectId,

                onData: (data) => {
                    setTasks(data);
                    setTaskError("");
                },

                onError: (error) => {
                    console.error(
                        "Task subscription failed:",
                        error
                    );

                    setTaskError(
                        "Unable to load tasks."
                    );
                },
            });

        return unsubscribe;
    }, [
        currentWorkspace?.id,
        projectId,
    ]);

    function openCreateTask(
        status =
            TASK_STATUS.BACKLOG
    ) {
        setCreateTaskStatus(
            status
        );

        setCreateTaskOpen(true);
    }

    const normalizedSearch =
        search
            .trim()
            .toLowerCase();

    const visibleTasks =
        normalizedSearch
            ? tasks.filter(
                (task) =>
                    task.title
                        ?.toLowerCase()
                        .includes(
                            normalizedSearch
                        ) ||
                    task.key
                        ?.toLowerCase()
                        .includes(
                            normalizedSearch
                        )
            )
            : tasks;

    if (projectLoading) {
        return (
            <div className="py-20 text-center text-sm text-muted">
                Loading project...
            </div>
        );
    }

    if (
        projectError ||
        !project
    ) {
        return (
            <div className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {projectError ||
                    "Project not found."}
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs text-muted">
                        Projects /{" "}
                        <span className="text-heading">
                            {project.name}
                        </span>
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-heading">
                        {project.name}
                    </h1>

                    <p className="mt-1 text-sm text-muted">
                        {project.description}
                    </p>
                </div>

                <Button
                    onClick={() =>
                        openCreateTask()
                    }
                >
                    <Plus size={16} />
                    New Task
                </Button>
            </div>

            <div className="mt-6 flex items-center gap-3 border-y border-border bg-surface py-3">
                <div className="relative w-full max-w-xs">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
                    />

                    <input
                        type="search"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
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

                <span className="text-xs text-muted">
                    {tasks.length} tasks
                </span>
            </div>

            {taskError && (
                <div className="mt-4 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {taskError}
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="mt-6 overflow-x-auto pb-5">
                    <div className="flex min-w-max items-start gap-4">
                        {BOARD_STATUSES.map(
                            (status) => {
                                const columnTasks =
                                    visibleTasks.filter(
                                        (task) =>
                                            task.status ===
                                            status
                                    );

                                return (
                                    <BoardColumn
                                        key={status}
                                        status={status}
                                        title={
                                            TASK_STATUS_LABELS[
                                            status
                                            ]
                                        }
                                        count={
                                            columnTasks.length
                                        }
                                        tasks={
                                            columnTasks
                                        }
                                        currentUser={
                                            user
                                        }
                                        onAddTask={() =>
                                            openCreateTask(
                                                status
                                            )
                                        }
                                        onTaskClick={
                                            openTaskDetails
                                        }
                                    />
                                );
                            }
                        )}
                    </div>
                </div>
            </DndContext>

            {createTaskOpen && (
                <CreateTaskModal
                    key={createTaskStatus}
                    onClose={() =>
                        setCreateTaskOpen(false)
                    }
                    project={project}
                    initialStatus={
                        createTaskStatus
                    }
                />
            )}

            {selectedTask && (
                <TaskDetailsDrawer
                    key={selectedTask.id}
                    task={selectedTask}
                    projectName={
                        project.name
                    }
                    onClose={
                        closeTaskDetails
                    }
                />
            )}
        </div>
    );
}

export default ProjectBoardPage;
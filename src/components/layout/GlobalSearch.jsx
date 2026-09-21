import {
    FolderKanban,
    Search,
    X,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router";

import useWorkspace from "../../hooks/useWorkspace";

import {
    subscribeToWorkspaceProjects,
} from "../../services/projectService";

import {
    subscribeToWorkspaceTasks,
} from "../../services/taskService";

function GlobalSearch() {
    const navigate =
        useNavigate();

    const {
        currentWorkspace,
    } = useWorkspace();

    const containerRef =
        useRef(null);

    const [search, setSearch] =
        useState("");

    const [projects, setProjects] =
        useState([]);

    const [tasks, setTasks] =
        useState([]);

    const [isOpen, setIsOpen] =
        useState(false);

    const workspaceId =
        currentWorkspace?.id;

    useEffect(() => {
        if (!workspaceId) {
            return;
        }

        const unsubscribeProjects =
            subscribeToWorkspaceProjects({
                workspaceId,

                onData:
                    setProjects,

                onError: (error) => {
                    console.error(
                        "Global project search subscription failed:",
                        error
                    );
                },
            });

        const unsubscribeTasks =
            subscribeToWorkspaceTasks({
                workspaceId,

                onData:
                    setTasks,

                onError: (error) => {
                    console.error(
                        "Global task search subscription failed:",
                        error
                    );
                },
            });

        return () => {
            unsubscribeProjects();
            unsubscribeTasks();
        };
    }, [workspaceId]);

    useEffect(() => {
        function handlePointerDown(
            event
        ) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target
                )
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown
            );
        };
    }, []);

    const normalizedSearch =
        search
            .trim()
            .toLowerCase();

    const projectResults =
        normalizedSearch
            ? projects
                .filter(
                    (project) =>
                        project.status ===
                        "active" &&
                        (
                            project.name
                                ?.toLowerCase()
                                .includes(
                                    normalizedSearch
                                ) ||
                            project.code
                                ?.toLowerCase()
                                .includes(
                                    normalizedSearch
                                ) ||
                            project.description
                                ?.toLowerCase()
                                .includes(
                                    normalizedSearch
                                )
                        )
                )
                .slice(0, 4)
            : [];

    const taskResults =
        normalizedSearch
            ? tasks
                .filter(
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
                            ) ||
                        task.description
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            )
                )
                .slice(0, 6)
            : [];

    const hasResults =
        projectResults.length > 0 ||
        taskResults.length > 0;

    function closeSearch() {
        setSearch("");
        setIsOpen(false);
    }

    function openProject(
        project
    ) {
        navigate(
            `/app/projects/${project.id}`
        );

        closeSearch();
    }

    function openTask(task) {
        navigate(
            `/app/projects/${task.projectId}?task=${task.id}`
        );

        closeSearch();
    }

    function handleKeyDown(
        event
    ) {
        if (
            event.key === "Escape"
        ) {
            setIsOpen(false);

            event.currentTarget.blur();

            return;
        }

        if (
            event.key !== "Enter" ||
            !normalizedSearch
        ) {
            return;
        }

        event.preventDefault();

        if (
            taskResults.length > 0
        ) {
            openTask(
                taskResults[0]
            );

            return;
        }

        if (
            projectResults.length > 0
        ) {
            openProject(
                projectResults[0]
            );
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full md:max-w-md"
        >
            <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
            />

            <input
                type="search"
                value={search}
                onFocus={() => {
                    if (
                        normalizedSearch
                    ) {
                        setIsOpen(true);
                    }
                }}
                onChange={(event) => {
                    setSearch(
                        event.target.value
                    );

                    setIsOpen(true);
                }}
                onKeyDown={
                    handleKeyDown
                }
                placeholder="Search tasks and projects..."
                className="
          h-9 w-full
          rounded-control
          border border-border
          bg-surface
          pl-9 pr-9
          text-sm text-heading
          outline-none
          placeholder:text-subtle
          focus:border-primary
          focus:ring-2
          focus:ring-primary/15
        "
            />

            {search && (
                <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Clear search"
                    className="
            absolute
            right-2
            top-1/2
            -translate-y-1/2
            rounded-control
            p-1
            text-subtle
            hover:bg-surface-muted
            hover:text-heading
          "
                >
                    <X size={14} />
                </button>
            )}

            {isOpen &&
                normalizedSearch && (
                    <div
                        className="
              absolute
  left-0
  top-[calc(100%+8px)]
  z-50
  max-h-[70vh]
  w-full
  overflow-y-auto
  rounded-panel
  border border-border
  bg-surface
  shadow-floating
            "
                    >
                        {!hasResults ? (
                            <div className="px-4 py-8 text-center">
                                <Search
                                    size={18}
                                    className="mx-auto text-subtle"
                                />

                                <p className="mt-2 text-sm font-medium text-heading">
                                    No results found
                                </p>

                                <p className="mt-1 text-xs text-muted">
                                    Try another task name, key, or project.
                                </p>
                            </div>
                        ) : (
                            <>
                                {projectResults.length >
                                    0 && (
                                        <div>
                                            <div className="border-b border-border bg-slate-50 px-3 py-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                                                    Projects
                                                </p>
                                            </div>

                                            {projectResults.map(
                                                (project) => (
                                                    <button
                                                        key={
                                                            project.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            openProject(
                                                                project
                                                            )
                                                        }
                                                        className="
                            flex
                            w-full
                            items-center
                            gap-3
                            border-b
                            border-border
                            px-3 py-3
                            text-left
                            last:border-b-0
                            hover:bg-slate-50
                          "
                                                    >
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-indigo-50 text-primary">
                                                            <FolderKanban
                                                                size={15}
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium text-heading">
                                                                {
                                                                    project.name
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-muted">
                                                                {
                                                                    project.code
                                                                }
                                                            </p>
                                                        </div>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}

                                {taskResults.length >
                                    0 && (
                                        <div>
                                            <div className="border-b border-border bg-slate-50 px-3 py-2">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                                                    Tasks
                                                </p>
                                            </div>

                                            {taskResults.map(
                                                (task) => (
                                                    <button
                                                        key={
                                                            task.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            openTask(
                                                                task
                                                            )
                                                        }
                                                        className="
                            flex
                            w-full
                            items-start
                            gap-3
                            border-b
                            border-border
                            px-3 py-3
                            text-left
                            last:border-b-0
                            hover:bg-slate-50
                          "
                                                    >
                                                        <div className="mt-0.5 flex h-8 min-w-12 shrink-0 items-center justify-center rounded-control bg-surface-muted px-2 text-[11px] font-semibold text-muted">
                                                            {task.key}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium text-heading">
                                                                {
                                                                    task.title
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 truncate text-xs capitalize text-muted">
                                                                {task.status
                                                                    ?.replaceAll(
                                                                        "_",
                                                                        " "
                                                                    )}
                                                            </p>
                                                        </div>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </>
                        )}
                    </div>
                )}
        </div>
    );
}

export default GlobalSearch;
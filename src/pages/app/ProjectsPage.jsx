import {
  Plus,
  Search,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Button from "../../components/ui/Button";
import CreateProjectModal from "../../components/projects/CreateProjectModal";
import ProjectCard from "../../components/projects/ProjectCard";

import useWorkspace from "../../hooks/useWorkspace";

import {
  getProjects,
} from "../../services/projectService";

function ProjectsPage() {
  const {
    currentWorkspace,
    currentMembership,
  } = useWorkspace();

  const workspaceId =
    currentWorkspace?.id || null;

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    status,
    setStatus,
  ] = useState("active");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loadedKey,
    setLoadedKey,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    refreshVersion,
    setRefreshVersion,
  ] = useState(0);

  const [
    createModalOpen,
    setCreateModalOpen,
  ] = useState(false);

  const canManageProjects =
    currentMembership?.role === "owner" ||
    currentMembership?.role === "admin";

  const requestKey = workspaceId
    ? `${workspaceId}:${status}:${refreshVersion}`
    : "";

  const loading =
    Boolean(workspaceId) &&
    loadedKey !== requestKey;

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const data = await getProjects({
          workspaceId,
          status,
        });

        if (cancelled) {
          return;
        }

        setProjects(data);
        setError("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load projects:",
          error
        );

        setProjects([]);

        setError(
          "Unable to load projects."
        );
      } finally {
        if (!cancelled) {
          setLoadedKey(requestKey);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [
    workspaceId,
    status,
    refreshVersion,
    requestKey,
  ]);

  function handleStatusChange(
    nextStatus
  ) {
    if (nextStatus === status) {
      return;
    }

    setError("");
    setStatus(nextStatus);
  }

  function handleProjectCreated() {
    setRefreshVersion(
      (current) => current + 1
    );
  }

  const filteredProjects =
    projects.filter((project) => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return true;
      }

      return (
        project.name
          ?.toLowerCase()
          .includes(query) ||
        project.code
          ?.toLowerCase()
          .includes(query) ||
        project.description
          ?.toLowerCase()
          .includes(query)
      );
    });

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-heading">
              Projects
            </h1>

            {!loading && (
              <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                {projects.length}{" "}
                {status}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-muted">
            Organize and manage work across{" "}
            {currentWorkspace?.name}.
          </p>
        </div>

        {canManageProjects && (
          <Button
            onClick={() =>
              setCreateModalOpen(true)
            }
          >
            <Plus size={16} />
            New Project
          </Button>
        )}
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
          />

          <input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="
              h-10 w-full
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

        <div className="inline-flex rounded-control border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() =>
              handleStatusChange(
                "active"
              )
            }
            className={`
              rounded-md
              px-3 py-1.5
              text-sm font-medium
              ${
                status === "active"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-muted hover:text-heading"
              }
            `}
          >
            Active
          </button>

          <button
            type="button"
            onClick={() =>
              handleStatusChange(
                "archived"
              )
            }
            className={`
              rounded-md
              px-3 py-1.5
              text-sm font-medium
              ${
                status === "archived"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-muted hover:text-heading"
              }
            `}
          >
            Archived
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-card border border-border bg-surface"
              />
            )
          )}
        </div>
      ) : filteredProjects.length >
        0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map(
            (project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            )
          )}
        </div>
      ) : (
        <div className="mt-12 rounded-card border border-dashed border-border p-12 text-center">
          <h2 className="text-base font-semibold text-heading">
            {search
              ? "No matching projects"
              : status === "active"
                ? "No projects yet"
                : "No archived projects"}
          </h2>

          <p className="mt-2 text-sm text-muted">
            {search
              ? "Try changing your search."
              : status === "active"
                ? "Create a project to start organizing your team's work."
                : "Archived projects will appear here."}
          </p>

          {!search &&
            status === "active" &&
            canManageProjects && (
              <Button
                className="mt-5"
                onClick={() =>
                  setCreateModalOpen(
                    true
                  )
                }
              >
                <Plus size={16} />

                Create Project
              </Button>
            )}
        </div>
      )}

      <CreateProjectModal
        open={createModalOpen}
        onClose={() =>
          setCreateModalOpen(false)
        }
        onCreated={
          handleProjectCreated
        }
      />
    </div>
  );
}

export default ProjectsPage;
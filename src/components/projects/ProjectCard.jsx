import {
  FolderKanban,
  MoreHorizontal,
} from "lucide-react";

import { Link } from "react-router";

import Avatar from "../ui/Avatar";

function ProjectCard({ project }) {
  return (
    <Link
      to={`/app/projects/${project.id}`}
      className="
        group block
        rounded-card
        border border-border
        bg-surface
        p-5
        transition
        hover:border-border-strong
        hover:shadow-sm
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-control bg-indigo-50 text-primary">
          <FolderKanban size={18} />
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
          }}
          aria-label="Project actions"
          className="rounded-control p-1.5 text-muted hover:bg-surface-muted hover:text-heading"
        >
          <MoreHorizontal size={17} />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-heading">
          {project.name}
        </h3>

        <p className="mt-0.5 text-xs text-subtle">
          {project.code}
        </p>

        <p className="mt-3 min-h-10 text-sm leading-5 text-muted">
          {project.description ||
            "No project description yet."}
        </p>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {project.taskCounter || 0} tasks
          </span>

          <span>0%</span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: "0%" }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <Avatar
          name="Project member"
          size="sm"
        />

        <span className="text-xs text-subtle">
          Just created
        </span>
      </div>
    </Link>
  );
}

export default ProjectCard;
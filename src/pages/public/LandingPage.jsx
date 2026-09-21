import {
  Activity,
  ArrowRight,
  Bell,
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Search,
  Users,
  Workflow,
} from "lucide-react";

import {
  Link,
} from "react-router";

import {
  ROUTES,
} from "../../constants/routes";

const features = [
  {
    icon: FolderKanban,
    title: "Project Boards",
    description:
      "Organize project work in a clear Kanban workflow from backlog through completion.",
  },
  {
    icon: Workflow,
    title: "Drag & Drop Workflow",
    description:
      "Move tasks between workflow stages while updates sync to collaborators in real time.",
  },
  {
    icon: MessageSquare,
    title: "Task Collaboration",
    description:
      "Keep task discussions alongside the work with comments, assignments, due dates, and labels.",
  },
  {
    icon: Activity,
    title: "Activity History",
    description:
      "See task creation, status changes, edits, and conversations in a structured activity timeline.",
  },
  {
    icon: Bell,
    title: "Realtime Notifications",
    description:
      "Stay informed about assignments and task conversations with recipient-specific notifications.",
  },
  {
    icon: Search,
    title: "Workspace Search",
    description:
      "Find projects and tasks quickly and jump directly into the relevant task details.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Create your workspace",
    description:
      "Set up a dedicated collaboration space for your team.",
  },
  {
    number: "02",
    title: "Invite your team",
    description:
      "Share a secure invitation and bring collaborators into the workspace.",
  },
  {
    number: "03",
    title: "Organize projects",
    description:
      "Create projects, define tasks, assign ownership, and track priorities.",
  },
  {
    number: "04",
    title: "Collaborate in real time",
    description:
      "Move work forward with live updates, comments, activity history, and notifications.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-app text-heading">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-base font-semibold tracking-tight text-heading"
          >
            CollabSpace
          </Link>

          <nav className="ml-10 hidden items-center gap-7 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted transition-colors hover:text-heading"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted transition-colors hover:text-heading"
            >
              How it works
            </a>

            <a
              href="#product"
              className="text-sm font-medium text-muted transition-colors hover:text-heading"
            >
              Product
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to={ROUTES.LOGIN}
              className="
                inline-flex h-9 items-center justify-center
                rounded-control
                px-3
                text-sm font-medium
                text-body
                transition-colors
                hover:bg-surface-muted
                hover:text-heading
              "
            >
              Sign in
            </Link>

            <Link
              to={ROUTES.REGISTER}
              className="
                inline-flex h-9 items-center justify-center gap-1.5
                rounded-control
                bg-primary
                px-4
                text-sm font-medium
                text-white
                transition-colors
                hover:bg-primary-hover
              "
            >
              Get Started

              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b border-border">
          <div
            className="
              mx-auto grid
              w-full max-w-7xl
              gap-12
              px-4
              py-16
              sm:px-6
              sm:py-20
              lg:grid-cols-[0.9fr_1.1fr]
              lg:items-center
              lg:px-8
              lg:py-24
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border border-indigo-200
                  bg-indigo-50
                  px-3 py-1.5
                  text-xs font-medium
                  text-indigo-700
                "
              >
                <Users size={13} />

                Built for collaborative project work
              </div>

              <h1
                className="
                  mt-6
                  max-w-3xl
                  text-4xl
                  font-semibold
                  tracking-tight
                  text-heading
                  sm:text-5xl
                  lg:text-[3.5rem]
                  lg:leading-[1.08]
                "
              >
                Keep projects, tasks, and team collaboration in one place.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-body sm:text-lg">
                CollabSpace is a real-time team workspace for organizing
                projects, managing tasks, collaborating through comments,
                and keeping everyone aligned as work changes.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={ROUTES.REGISTER}
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-control
                    bg-primary
                    px-5
                    text-sm font-medium
                    text-white
                    transition-colors
                    hover:bg-primary-hover
                  "
                >
                  Create your workspace

                  <ArrowRight size={16} />
                </Link>

                <Link
                  to={ROUTES.LOGIN}
                  className="
                    inline-flex
                    h-11
                    items-center
                    justify-center
                    rounded-control
                    border border-border
                    bg-surface
                    px-5
                    text-sm font-medium
                    text-heading
                    transition-colors
                    hover:bg-surface-muted
                  "
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2
                    size={14}
                    className="text-success"
                  />

                  Real-time updates
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2
                    size={14}
                    className="text-success"
                  />

                  Team workspaces
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2
                    size={14}
                    className="text-success"
                  />

                  Task collaboration
                </span>
              </div>
            </div>

            {/* Product preview */}
            <div
              className="
                overflow-hidden
                rounded-panel
                border border-border
                bg-surface
                shadow-floating
              "
            >
              <div className="flex h-12 items-center justify-between border-b border-border px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>

                <span className="text-xs font-medium text-muted">
                  Website Redesign
                </span>

                <div className="w-12" />
              </div>

              <div className="grid min-h-[420px] grid-cols-[150px_1fr] sm:grid-cols-[190px_1fr]">
                <div className="border-r border-border bg-slate-50 p-3">
                  <div className="mb-5 px-2 py-2 text-sm font-semibold text-heading">
                    CollabSpace
                  </div>

                  <div className="space-y-1">
                    {[
                      {
                        icon: LayoutDashboard,
                        label: "Dashboard",
                      },
                      {
                        icon: FolderKanban,
                        label: "Projects",
                        active: true,
                      },
                      {
                        icon: CheckCircle2,
                        label: "My Tasks",
                      },
                      {
                        icon: Activity,
                        label: "Activity",
                      },
                      {
                        icon: Users,
                        label: "Members",
                      },
                    ].map(
                      ({
                        icon: Icon,
                        label,
                        active,
                      }) => (
                        <div
                          key={label}
                          className={`
                            flex items-center gap-2
                            rounded-control
                            px-2.5 py-2
                            text-xs font-medium

                            ${
                              active
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-muted"
                            }
                          `}
                        >
                          <Icon size={14} />

                          <span className="hidden sm:inline">
                            {label}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="min-w-0 bg-app p-4 sm:p-5">
                  <div>
                    <p className="text-[10px] text-muted">
                      Projects / Website Redesign
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <h2 className="text-base font-semibold text-heading">
                        Website Redesign
                      </h2>

                      <span className="rounded-control bg-primary px-2.5 py-1.5 text-[10px] font-medium text-white">
                        New Task
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden">
                    <div className="flex min-w-max gap-3">
                      {[
                        {
                          title: "Backlog",
                          tasks: [
                            "Build reusable form components",
                          ],
                        },
                        {
                          title: "To Do",
                          tasks: [
                            "Responsive navigation",
                            "Update project cards",
                          ],
                        },
                        {
                          title: "In Progress",
                          tasks: [
                            "Mobile task drawer",
                          ],
                        },
                      ].map(
                        (column) => (
                          <div
                            key={column.title}
                            className="
                              w-40
                              rounded-card
                              border border-border
                              bg-slate-50
                              p-2.5
                              sm:w-44
                            "
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-heading">
                                {column.title}
                              </span>

                              <span className="text-[9px] text-muted">
                                {
                                  column.tasks
                                    .length
                                }
                              </span>
                            </div>

                            <div className="mt-2.5 space-y-2">
                              {column.tasks.map(
                                (
                                  task,
                                  index
                                ) => (
                                  <div
                                    key={task}
                                    className="rounded-control border border-border bg-surface p-2.5"
                                  >
                                    <span className="text-[8px] font-medium text-subtle">
                                      WEB-
                                      {index +
                                        1}
                                    </span>

                                    <p className="mt-1.5 text-[10px] font-medium leading-4 text-heading">
                                      {task}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between">
                                      <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[8px] text-amber-700">
                                        Medium
                                      </span>

                                      <span className="h-5 w-5 rounded-full bg-indigo-100" />
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-20 border-b border-border bg-surface"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Product features
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-heading">
                Everything needed to keep team work moving.
              </h2>

              <p className="mt-4 text-base leading-7 text-body">
                CollabSpace connects project planning, task execution,
                communication, and visibility in one consistent workspace.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map(
                ({
                  icon: Icon,
                  title,
                  description,
                }) => (
                  <article
                    key={title}
                    className="
                      rounded-card
                      border border-border
                      bg-surface
                      p-5
                      transition
                      hover:border-border-strong
                      hover:shadow-sm
                    "
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-control bg-indigo-50 text-primary">
                      <Icon size={17} />
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-heading">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-body">
                      {description}
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-b border-border"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-heading">
                From workspace setup to real-time collaboration.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflow.map(
                ({
                  number,
                  title,
                  description,
                }) => (
                  <article
                    key={number}
                    className="border-t border-border pt-5"
                  >
                    <span className="text-xs font-semibold text-primary">
                      {number}
                    </span>

                    <h3 className="mt-4 text-base font-semibold text-heading">
                      {title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-body">
                      {description}
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        </section>

        {/* Product detail */}
        <section
          id="product"
          className="scroll-mt-20 border-b border-border bg-surface"
        >
          <div
            className="
              mx-auto grid
              w-full max-w-7xl
              gap-12
              px-4
              py-16
              sm:px-6
              sm:py-20
              lg:grid-cols-2
              lg:items-center
              lg:px-8
            "
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Built around the work
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-heading">
                The context stays with the task.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-body">
                Open a task without losing the project board behind it.
                Update status, priority, assignee, due date, labels,
                description, comments, and activity from one focused
                workspace.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Task details stay connected to the project board.",
                  "Comments update for collaborators without refreshing.",
                  "Activity records make project changes easy to follow.",
                  "Deep links open the exact task from search, activity, or notifications.",
                ].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-success"
                      />

                      <p className="text-sm leading-6 text-body">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-panel border border-border bg-app p-4 sm:p-6">
              <div className="rounded-panel border border-border bg-surface shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                      WEB-1
                    </span>

                    <h3 className="mt-3 text-lg font-semibold text-heading">
                      Implement responsive navigation
                    </h3>
                  </div>

                  <span className="text-muted">
                    ×
                  </span>
                </div>

                <div className="p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      [
                        "Status",
                        "In Progress",
                      ],
                      [
                        "Priority",
                        "High",
                      ],
                      [
                        "Assignee",
                        "Ahamed Nasith",
                      ],
                      [
                        "Due date",
                        "Sep 28",
                      ],
                    ].map(
                      ([
                        label,
                        value,
                      ]) => (
                        <div
                          key={label}
                          className="rounded-control border border-border bg-slate-50 p-3"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                            {label}
                          </p>

                          <p className="mt-1.5 text-xs font-medium text-heading">
                            {value}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    <div className="flex gap-5 text-xs font-medium">
                      <span className="border-b-2 border-primary pb-2 text-primary">
                        Comments
                      </span>

                      <span className="pb-2 text-muted">
                        Activity
                      </span>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700">
                        AN
                      </span>

                      <div>
                        <p className="text-xs font-medium text-heading">
                          Ahamed Nasith
                        </p>

                        <p className="mt-1 text-xs leading-5 text-body">
                          Mobile navigation is ready for review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div
              className="
                flex flex-col
                gap-6
                rounded-panel
                border border-border
                bg-surface
                p-6
                sm:p-8
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-heading">
                  Bring your team's work into one collaborative space.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
                  Create a workspace, organize your projects, and start
                  collaborating on tasks in real time.
                </p>
              </div>

              <Link
                to={ROUTES.REGISTER}
                className="
                  inline-flex
                  h-11
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-control
                  bg-primary
                  px-5
                  text-sm font-medium
                  text-white
                  transition-colors
                  hover:bg-primary-hover
                "
              >
                Get Started

                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div
          className="
            mx-auto flex
            w-full max-w-7xl
            flex-col
            gap-4
            px-4
            py-6
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
            lg:px-8
          "
        >
          <div>
            <p className="text-sm font-semibold text-heading">
              CollabSpace
            </p>

            <p className="mt-1 text-xs text-muted">
              Real-time collaborative project workspace.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Link
              to={ROUTES.LOGIN}
              className="text-xs font-medium text-muted hover:text-heading"
            >
              Sign in
            </Link>

            <Link
              to={ROUTES.REGISTER}
              className="text-xs font-medium text-muted hover:text-heading"
            >
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
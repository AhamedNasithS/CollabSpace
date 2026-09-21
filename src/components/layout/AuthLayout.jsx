import { Link, Outlet } from "react-router";

import { ROUTES } from "../../constants/routes";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-app">
      <div className="px-5 py-6">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-base font-semibold text-heading"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-control bg-primary text-sm font-semibold text-white">
            C
          </div>

          CollabSpace
        </Link>
      </div>

      <main className="flex min-h-[calc(100vh-80px)] items-start justify-center px-4 pb-12 pt-12 sm:pt-20">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
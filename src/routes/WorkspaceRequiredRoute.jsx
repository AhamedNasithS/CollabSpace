import {
  Navigate,
  Outlet,
} from "react-router";

import { ROUTES } from "../constants/routes";

import useWorkspace from "../hooks/useWorkspace";

function WorkspaceRequiredRoute() {
  const {
    hasWorkspace,
    workspaceLoading,
  } = useWorkspace();

  if (workspaceLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" />

          <p className="mt-3 text-sm text-muted">
            Loading workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!hasWorkspace) {
    return (
      <Navigate
        to={
          ROUTES.WORKSPACE_SETUP
        }
        replace
      />
    );
  }

  return <Outlet />;
}

export default WorkspaceRequiredRoute;
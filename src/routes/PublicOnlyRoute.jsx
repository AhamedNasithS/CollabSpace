import {
  Navigate,
  Outlet,
} from "react-router";

import { ROUTES } from "../constants/routes";

import useAuth from "../hooks/useAuth";
import useWorkspace from "../hooks/useWorkspace";

function PublicOnlyRoute() {
  const {
    isAuthenticated,
    authLoading,
  } = useAuth();

  const {
    hasWorkspace,
    workspaceLoading,
  } = useWorkspace();

  if (
    authLoading ||
    (
      isAuthenticated &&
      workspaceLoading
    )
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" />

          <p className="mt-3 text-sm text-muted">
            Loading CollabSpace...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={
          hasWorkspace
            ? ROUTES.DASHBOARD
            : ROUTES.WORKSPACE_SETUP
        }
        replace
      />
    );
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
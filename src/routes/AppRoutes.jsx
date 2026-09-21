import {
    Navigate,
    Route,
    Routes,
} from "react-router";

import { ROUTES } from "../constants/routes";

import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";
import PublicLayout from "../components/layout/PublicLayout";
import PagePlaceholder from "../components/ui/PagePlaceholder";

import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import WorkspaceSetupPage from "../pages/onboarding/WorkspaceSetupPage";
import WorkspaceRequiredRoute from "./WorkspaceRequiredRoute";

import JoinWorkspacePage from "../pages/auth/JoinWorkspacePage";

import DashboardPage from "../pages/app/DashboardPage";

import ProjectsPage from "../pages/app/ProjectsPage";

import ProjectBoardPage from "../pages/app/ProjectBoardPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

import NotificationsPage from "../pages/app/NotificationsPage";

import ActivityPage from "../pages/app/ActivityPage";
import MyTasksPage from "../pages/app/MyTasksPage";
import MembersPage from "../pages/app/MembersPage";
import WorkspaceSettingsPage from "../pages/app/WorkspaceSettingsPage";
import ProfilePage from "../pages/app/ProfilePage";

import LandingPage from "../pages/public/LandingPage";

function AppRoutes() {
    return (
        <Routes>
            {/* Public landing page */}
            <Route element={<PublicLayout />}>
                <Route
                    path="/"
                    element={<LandingPage />}
                />
            </Route>

            {/* Logged-out only authentication pages */}
            <Route element={<PublicOnlyRoute />}>
                <Route element={<AuthLayout />}>
                    <Route
                        path={ROUTES.LOGIN}
                        element={<LoginPage />}
                    />

                    <Route
                        path={ROUTES.REGISTER}
                        element={<RegisterPage />}
                    />

                    <Route
                        path={ROUTES.FORGOT_PASSWORD}
                        element={<ForgotPasswordPage />}
                    />
                </Route>
            </Route>

            {/* Join invitation must work logged in or logged out */}
            <Route element={<AuthLayout />}>
                <Route
                    path={ROUTES.JOIN_WORKSPACE}
                    element={<JoinWorkspacePage />}
                />
            </Route>

            {/* Authentication required */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AuthLayout />}>
                    <Route
                        path={ROUTES.WORKSPACE_SETUP}
                        element={
                            <WorkspaceSetupPage />
                        }
                    />
                </Route>

                <Route
                    element={
                        <WorkspaceRequiredRoute />
                    }
                >
                    <Route
                        path={ROUTES.APP}
                        element={<AppLayout />}
                    >
                        <Route
                            index
                            element={
                                <Navigate
                                    to={ROUTES.DASHBOARD}
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={<DashboardPage />}
                        />

                        <Route
                            path="projects"
                            element={<ProjectsPage />}
                        />

                        <Route
                            path="projects/:projectId"
                            element={<ProjectBoardPage />}
                        />

                        <Route
                            path="my-tasks"
                            element={<MyTasksPage />}
                        />

                        <Route
                            path="activity"
                            element={<ActivityPage />}
                        />

                        <Route
                            path="members"
                            element={<MembersPage />}
                        />

                        <Route
                            path="/app/notifications"
                            element={<NotificationsPage />}
                        />

                        <Route
                            path="settings/workspace"
                            element={
                                <WorkspaceSettingsPage />
                            }
                        />

                        <Route
                            path="profile"
                            element={<ProfilePage />}
                        />
                    </Route>
                </Route>
            </Route>

            <Route
                path="*"
                element={
                    <PagePlaceholder
                        title="404"
                        description="The page you're looking for doesn't exist."
                    />
                }
            />
        </Routes>
    );
}

export default AppRoutes;
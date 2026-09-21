import {
    BriefcaseBusiness,
    Mail,
    UserRound,
} from "lucide-react";

import {
    useState,
} from "react";

import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";

import useAuth from "../../hooks/useAuth";

import {
    updateAuthDisplayName,
} from "../../services/authService";

import {
    updateUserProfile,
} from "../../services/userService";

function ProfileForm({
    user,
    profile,
    refreshProfile,
}) {
    const [
        displayName,
        setDisplayName,
    ] = useState(
        profile?.displayName ||
        user.displayName ||
        ""
    );

    const [
        jobTitle,
        setJobTitle,
    ] = useState(
        profile?.jobTitle || ""
    );

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    async function handleSubmit(
        event
    ) {
        event.preventDefault();

        const trimmedName =
            displayName.trim();

        const trimmedJobTitle =
            jobTitle.trim();

        if (!trimmedName) {
            setError(
                "Display name is required."
            );

            return;
        }

        try {
            setIsSaving(true);

            setError("");
            setSuccess("");

            try {
                await updateAuthDisplayName(
                    trimmedName
                );
            } catch (error) {
                console.error(
                    "Firebase Auth profile update failed:",
                    error
                );

                throw error;
            }

            try {
                await updateUserProfile({
                    userId:
                        user.uid,

                    displayName:
                        trimmedName,

                    email:
                        user.email || "",

                    jobTitle:
                        trimmedJobTitle,

                    photoURL:
                        profile?.photoURL ||
                        user.photoURL ||
                        null,
                });
            } catch (error) {
                console.error(
                    "Firestore profile update failed:",
                    error
                );

                throw error;
            }

            await refreshProfile();

            setSuccess(
                "Profile updated successfully."
            );
        } catch (error) {
            console.error(
                "Profile update failed:",
                {
                    code: error?.code,
                    message: error?.message,
                    error,
                }
            );

            setError(
                error?.message ||
                "We couldn't update your profile. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-panel border border-border bg-surface"
        >
            <div className="flex items-center gap-4 border-b border-border px-6 py-5">
                <Avatar
                    name={
                        displayName ||
                        user.email
                    }
                    src={
                        profile?.photoURL ||
                        user.photoURL ||
                        null
                    }
                    size="lg"
                />

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-heading">
                        {displayName ||
                            "User"}
                    </p>

                    <p className="mt-0.5 truncate text-sm text-muted">
                        {user.email}
                    </p>
                </div>
            </div>

            <div className="p-6">
                {error && (
                    <div className="mb-5 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-control border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-heading">
                        <UserRound
                            size={14}
                        />

                        Display name
                    </label>

                    <input
                        value={displayName}
                        maxLength={80}
                        disabled={isSaving}
                        onChange={(event) => {
                            setDisplayName(
                                event.target.value
                            );

                            setError("");
                            setSuccess("");
                        }}
                        placeholder="Your name"
                        className="
              h-10 w-full
              rounded-control
              border border-border
              bg-surface
              px-3
              text-sm text-heading
              outline-none
              disabled:bg-surface-muted
              focus:border-primary
              focus:ring-2
              focus:ring-primary/15
            "
                    />
                </div>

                <div className="mt-5">
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-heading">
                        <BriefcaseBusiness
                            size={14}
                        />

                        Job title
                    </label>

                    <input
                        value={jobTitle}
                        maxLength={100}
                        disabled={isSaving}
                        onChange={(event) => {
                            setJobTitle(
                                event.target.value
                            );

                            setSuccess("");
                        }}
                        placeholder="e.g. Frontend Developer"
                        className="
              h-10 w-full
              rounded-control
              border border-border
              bg-surface
              px-3
              text-sm text-heading
              outline-none
              placeholder:text-subtle
              disabled:bg-surface-muted
              focus:border-primary
              focus:ring-2
              focus:ring-primary/15
            "
                    />
                </div>

                <div className="mt-5">
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-heading">
                        <Mail size={14} />

                        Email
                    </label>

                    <input
                        type="email"
                        value={
                            user.email || ""
                        }
                        disabled
                        className="
              h-10 w-full
              cursor-not-allowed
              rounded-control
              border border-border
              bg-surface-muted
              px-3
              text-sm text-muted
              outline-none
            "
                    />

                    <p className="mt-1.5 text-xs text-muted">
                        Email changes aren't supported from the profile page yet.
                    </p>
                </div>

                <div className="mt-6 flex justify-end border-t border-border pt-5">
                    <Button
                        type="submit"
                        disabled={
                            isSaving ||
                            !displayName.trim()
                        }
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save Profile"}
                    </Button>
                </div>
            </div>
        </form>
    );
}

function ProfilePage() {
    const {
        user,
        profile,
        refreshProfile,
    } = useAuth();

    if (!user) {
        return null;
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-heading">
                    Profile
                </h1>

                <p className="mt-1 text-sm text-muted">
                    Manage your personal information and workspace identity.
                </p>
            </div>

            <div className="mt-6">
                <ProfileForm
                    key={user.uid}
                    user={user}
                    profile={profile}
                    refreshProfile={
                        refreshProfile
                    }
                />
            </div>
        </div>
    );
}

export default ProfilePage;
import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    deleteUser,
    sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";

import { auth } from "../firebase/firebase";
import {
    createUserProfile,
    ensureUserProfile,
} from "./userService";

export async function registerWithEmail({
    displayName,
    email,
    password,
}) {
    await setPersistence(
        auth,
        browserLocalPersistence
    );

    const credential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

    const user = credential.user;

    try {
        await updateProfile(user, {
            displayName,
        });

        await createUserProfile(user, {
            displayName,
        });

        return user;
    } catch (error) {
        try {
            await deleteUser(user);
        } catch (cleanupError) {
            console.error(
                "Failed to clean up incomplete registration:",
                cleanupError
            );
        }

        throw error;
    }
}

export async function loginWithEmail({
    email,
    password,
}) {
    await setPersistence(auth, browserLocalPersistence);

    const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    await ensureUserProfile(credential.user);

    return credential.user;
}

export async function sendResetEmail(email) {
    await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
    await signOut(auth);
}

export async function updateAuthDisplayName(
  displayName
) {
  const currentUser =
    auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "No authenticated user."
    );
  }

  await updateProfile(
    currentUser,
    {
      displayName,
    }
  );
}
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function createUserProfile(user, data = {}) {
  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    uid: user.uid,
    displayName: data.displayName || user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || null,
    jobTitle: data.jobTitle || "",
    lastWorkspaceId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(userId) {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function ensureUserProfile(user) {
  const existingProfile = await getUserProfile(user.uid);

  if (existingProfile) {
    return existingProfile;
  }

  await createUserProfile(user);

  return getUserProfile(user.uid);
}

export async function updateUserProfile({
  userId,
  displayName,
  email,
  jobTitle,
  photoURL = null,
}) {
  if (!userId) {
    throw new Error(
      "User ID is required."
    );
  }

  const userRef = doc(
    db,
    "users",
    userId
  );

  const membershipsQuery = query(
    collection(
      db,
      "workspaceMembers"
    ),
    where(
      "userId",
      "==",
      userId
    )
  );

  const membershipSnapshot =
    await getDocs(
      membershipsQuery
    );

  const profileSnapshot = {
    displayName,
    email,
    jobTitle,
    photoURL,
  };

  const batch =
    writeBatch(db);

  batch.update(
    userRef,
    {
      displayName,
      email,
      jobTitle,
      photoURL,

      updatedAt:
        serverTimestamp(),
    }
  );

  membershipSnapshot.docs.forEach(
    (membershipDoc) => {
      batch.update(
        membershipDoc.ref,
        {
          profile:
            profileSnapshot,

          updatedAt:
            serverTimestamp(),
        }
      );
    }
  );

  await batch.commit();
}

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function createWorkspace({
  name,
  description,
  user,
  profile,
}) {
  const workspaceRef = doc(
    collection(db, "workspaces")
  );

  const membershipId =
    `${workspaceRef.id}_${user.uid}`;

  const membershipRef = doc(
    db,
    "workspaceMembers",
    membershipId
  );

  const userRef = doc(
    db,
    "users",
    user.uid
  );

  const batch = writeBatch(db);

  batch.set(workspaceRef, {
    name,
    description: description || "",
    icon: "building",

    ownerId: user.uid,
    createdBy: user.uid,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    deletedAt: null,
  });

  batch.set(membershipRef, {
    workspaceId: workspaceRef.id,
    userId: user.uid,

    role: "owner",

    joinedAt: serverTimestamp(),
    invitedBy: null,

    profile: {
      displayName:
        profile?.displayName ||
        user.displayName ||
        "",

      email:
        profile?.email ||
        user.email ||
        "",

      photoURL:
        profile?.photoURL ||
        user.photoURL ||
        null,

      jobTitle:
        profile?.jobTitle || "",
    },
  });

  batch.update(userRef, {
    lastWorkspaceId: workspaceRef.id,
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return workspaceRef.id;
}

export async function getWorkspace(
  workspaceId
) {
  const workspaceRef = doc(
    db,
    "workspaces",
    workspaceId
  );

  const snapshot = await getDoc(workspaceRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function getUserMemberships(
  userId
) {
  const membershipsQuery = query(
    collection(db, "workspaceMembers"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(
    membershipsQuery
  );

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function updateWorkspace({
  workspaceId,
  name,
  description,
}) {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required."
    );
  }

  const workspaceRef = doc(
    db,
    "workspaces",
    workspaceId
  );

  await updateDoc(
    workspaceRef,
    {
      name: name.trim(),

      description:
        description.trim(),

      updatedAt:
        serverTimestamp(),
    }
  );
}
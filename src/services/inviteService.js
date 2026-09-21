import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function generateInviteToken() {
  return crypto.randomUUID().replaceAll("-", "");
}

function getInviteExpiryDate() {
  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + 7
  );

  return expiresAt;
}

export async function createWorkspaceInvite({
  workspace,
  userId,
}) {
  const inviteToken =
    generateInviteToken();

  const inviteRef = doc(
    db,
    "workspaceInvites",
    inviteToken
  );

  await setDoc(inviteRef, {
    workspaceId: workspace.id,

    workspaceName: workspace.name,

    workspaceIcon:
      workspace.icon || "building",

    role: "member",

    createdBy: userId,

    createdAt: serverTimestamp(),

    expiresAt: Timestamp.fromDate(
      getInviteExpiryDate()
    ),

    revokedAt: null,
  });

  return inviteToken;
}

export async function getWorkspaceInvite(
  inviteToken
) {
  const inviteRef = doc(
    db,
    "workspaceInvites",
    inviteToken
  );

  const snapshot =
    await getDoc(inviteRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function revokeWorkspaceInvite(
  inviteToken
) {
  const inviteRef = doc(
    db,
    "workspaceInvites",
    inviteToken
  );

  await updateDoc(inviteRef, {
    revokedAt: serverTimestamp(),
  });
}

export function isInviteValid(invite) {
  if (!invite) {
    return false;
  }

  if (invite.revokedAt) {
    return false;
  }

  const expiresAt =
    invite.expiresAt?.toDate?.();

  if (
    expiresAt &&
    expiresAt <= new Date()
  ) {
    return false;
  }

  return true;
}

export async function acceptWorkspaceInvite({
  invite,
  user,
  profile,
}) {
  const membershipId =
    `${invite.workspaceId}_${user.uid}`;

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

  batch.set(membershipRef, {
    workspaceId:
      invite.workspaceId,

    userId:
      user.uid,

    role:
      invite.role || "member",

    joinedAt:
      serverTimestamp(),

    invitedBy:
      invite.createdBy,

    inviteToken:
      invite.id,

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
    lastWorkspaceId:
      invite.workspaceId,

    updatedAt:
      serverTimestamp(),
  });

  await batch.commit();

  return invite.workspaceId;
}
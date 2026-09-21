import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function getProject(
  projectId
) {
  const projectRef = doc(
    db,
    "projects",
    projectId
  );

  const snapshot = await getDoc(
    projectRef
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function getProjects({
  workspaceId,
  status = "active",
}) {
  const projectsQuery = query(
    collection(db, "projects"),
    where("workspaceId", "==", workspaceId),
    where("status", "==", status),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(projectsQuery);

  return snapshot.docs.map((projectDoc) => ({
    id: projectDoc.id,
    ...projectDoc.data(),
  }));
}

export async function projectCodeExists({
  workspaceId,
  code,
}) {
  const codeQuery = query(
    collection(db, "projects"),
    where("workspaceId", "==", workspaceId),
    where("code", "==", code)
  );

  const snapshot = await getDocs(codeQuery);

  return !snapshot.empty;
}

export async function createProject({
  workspaceId,
  userId,
  name,
  description,
  code,
}) {
  const projectRef = doc(
    collection(db, "projects")
  );

  await setDoc(projectRef, {
    workspaceId,

    name,
    description,

    code,

    icon: "folder",
    color: "indigo",

    status: "active",

    memberIds: [userId],

    taskCounter: 0,

    createdBy: userId,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),

    archivedAt: null,
  });

  return projectRef.id;
}

export async function archiveProject(
  projectId
) {
  const projectRef = doc(
    db,
    "projects",
    projectId
  );

  await updateDoc(projectRef, {
    status: "archived",
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToWorkspaceProjects({
  workspaceId,
  onData,
  onError,
}) {
  const projectsQuery = query(
    collection(db, "projects"),
    where(
      "workspaceId",
      "==",
      workspaceId
    )
  );

  return onSnapshot(
    projectsQuery,
    (snapshot) => {
      const projects =
        snapshot.docs.map(
          (projectDoc) => ({
            id: projectDoc.id,
            ...projectDoc.data(),
          })
        );

      projects.sort(
        (a, b) =>
          (b.updatedAt?.seconds || 0) -
          (a.updatedAt?.seconds || 0)
      );

      onData(projects);
    },
    onError
  );
}
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export function subscribeToTaskActivity({
  workspaceId,
  taskId,
  onData,
  onError,
}) {
  const activityQuery = query(
    collection(db, "activities"),
    where(
      "workspaceId",
      "==",
      workspaceId
    ),
    where(
      "taskId",
      "==",
      taskId
    )
  );

  return onSnapshot(
    activityQuery,
    (snapshot) => {
      const activities =
        snapshot.docs.map(
          (activityDoc) => ({
            id: activityDoc.id,
            ...activityDoc.data(),
          })
        );

      activities.sort((a, b) => {
        const first =
          a.createdAt?.seconds || 0;

        const second =
          b.createdAt?.seconds || 0;

        return second - first;
      });

      onData(activities);
    },
    onError
  );
}

export function subscribeToWorkspaceActivity({
  workspaceId,
  onData,
  onError,
}) {
  const activityQuery = query(
    collection(db, "activities"),
    where(
      "workspaceId",
      "==",
      workspaceId
    )
  );

  return onSnapshot(
    activityQuery,
    (snapshot) => {
      const activities =
        snapshot.docs.map(
          (activityDoc) => ({
            id: activityDoc.id,
            ...activityDoc.data(),
          })
        );

      activities.sort((a, b) => {
        const first =
          a.createdAt?.seconds || 0;

        const second =
          b.createdAt?.seconds || 0;

        return second - first;
      });

      onData(
        activities.slice(0, 100)
      );
    },
    onError
  );
}
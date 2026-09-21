import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export function subscribeToNotifications({
  workspaceId,
  userId,
  onData,
  onError,
}) {
  const notificationsQuery = query(
    collection(
      db,
      "notifications"
    ),
    where(
      "workspaceId",
      "==",
      workspaceId
    ),
    where(
      "recipientId",
      "==",
      userId
    )
  );

  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      const notifications =
        snapshot.docs.map(
          (notificationDoc) => ({
            id:
              notificationDoc.id,

            ...notificationDoc.data(),
          })
        );

      notifications.sort(
        (a, b) => {
          const first =
            a.createdAt?.seconds ||
            0;

          const second =
            b.createdAt?.seconds ||
            0;

          return second - first;
        }
      );

      onData(notifications);
    },
    onError
  );
}

export async function markNotificationRead(
  notificationId
) {
  const notificationRef = doc(
    db,
    "notifications",
    notificationId
  );

  await updateDoc(
    notificationRef,
    {
      isRead: true,

      readAt:
        serverTimestamp(),
    }
  );
}

export async function markAllNotificationsRead(
  notifications
) {
  const unread =
    notifications.filter(
      (notification) =>
        !notification.isRead
    );

  if (unread.length === 0) {
    return;
  }

  const batch =
    writeBatch(db);

  unread.forEach(
    (notification) => {
      const notificationRef =
        doc(
          db,
          "notifications",
          notification.id
        );

      batch.update(
        notificationRef,
        {
          isRead: true,

          readAt:
            serverTimestamp(),
        }
      );
    }
  );

  await batch.commit();
}
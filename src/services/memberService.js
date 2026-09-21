import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export function subscribeToWorkspaceMembers({
  workspaceId,
  onData,
  onError,
}) {
  const membersQuery = query(
    collection(db, "workspaceMembers"),
    where(
      "workspaceId",
      "==",
      workspaceId
    )
  );

  return onSnapshot(
    membersQuery,
    (snapshot) => {
      const members =
        snapshot.docs.map(
          (memberDoc) => ({
            id: memberDoc.id,
            ...memberDoc.data(),
          })
        );

      const roleOrder = {
        owner: 0,
        admin: 1,
        member: 2,
      };

      members.sort(
        (a, b) => {
          const firstRole =
            roleOrder[a.role] ?? 99;

          const secondRole =
            roleOrder[b.role] ?? 99;

          if (
            firstRole !== secondRole
          ) {
            return (
              firstRole -
              secondRole
            );
          }

          const firstName =
            a.profile?.displayName ||
            "";

          const secondName =
            b.profile?.displayName ||
            "";

          return firstName.localeCompare(
            secondName
          );
        }
      );

      onData(members);
    },
    onError
  );
}
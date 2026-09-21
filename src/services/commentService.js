import {
    collection,
    doc,
    onSnapshot,
    query,
    runTransaction,
    serverTimestamp,
    where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export function subscribeToTaskComments({
    workspaceId,
    taskId,
    onData,
    onError,
}) {
    const commentsQuery = query(
        collection(db, "comments"),
        where("workspaceId", "==", workspaceId),
        where("taskId", "==", taskId)
    );

    return onSnapshot(
        commentsQuery,
        (snapshot) => {
            const comments =
                snapshot.docs.map(
                    (commentDoc) => ({
                        id: commentDoc.id,
                        ...commentDoc.data(),
                    })
                );

            comments.sort((a, b) => {
                const first =
                    a.createdAt?.seconds || 0;

                const second =
                    b.createdAt?.seconds || 0;

                return first - second;
            });

            onData(comments);
        },
        onError
    );
}

export async function createComment({
    task,
    user,
    profile,
    body,
}) {
    if (!user?.uid) {
        throw new Error(
            "User is required to add a comment."
        );
    }

    const message =
        body?.trim();

    if (!message) {
        throw new Error(
            "Comment cannot be empty."
        );
    }

    if (!task?.id) {
        throw new Error(
            "Task is required."
        );
    }

    const taskRef = doc(
        db,
        "tasks",
        task.id
    );

    const commentRef = doc(
        collection(db, "comments")
    );

    const activityRef = doc(
        collection(db, "activities")
    );

    await runTransaction(
        db,
        async (transaction) => {
            const taskSnapshot =
                await transaction.get(
                    taskRef
                );

            if (!taskSnapshot.exists()) {
                throw new Error(
                    "Task not found."
                );
            }

            const latestTask =
                taskSnapshot.data();

            const displayName =
                profile?.displayName ||
                user.displayName ||
                user.email ||
                "User";

            const photoURL =
                profile?.photoURL ||
                user.photoURL ||
                null;

            transaction.set(
                commentRef,
                {
                    workspaceId:
                        latestTask.workspaceId,

                    projectId:
                        latestTask.projectId,

                    taskId:
                        task.id,

                    authorId:
                        user.uid,

                    authorSnapshot: {
                        displayName,
                        photoURL,
                    },

                    body:
                        message,

                    mentionedUserIds: [],

                    createdAt:
                        serverTimestamp(),

                    updatedAt: null,
                }
            );

            transaction.update(
                taskRef,
                {
                    commentCount:
                        (latestTask.commentCount ||
                            0) + 1,

                    updatedAt:
                        serverTimestamp(),
                }
            );

            transaction.set(
                activityRef,
                {
                    workspaceId:
                        latestTask.workspaceId,

                    projectId:
                        latestTask.projectId,

                    taskId:
                        task.id,

                    actorId:
                        user.uid,

                    actorSnapshot: {
                        displayName,
                        photoURL,
                    },

                    type:
                        "task_commented",

                    metadata: {
                        taskKey:
                            latestTask.key,

                        taskTitle:
                            latestTask.title,

                        commentId:
                            commentRef.id,
                    },

                    createdAt:
                        serverTimestamp(),
                }
            );

            const recipients =
                new Set();

            if (
                latestTask.assigneeId &&
                latestTask.assigneeId !==
                user.uid
            ) {
                recipients.add(
                    latestTask.assigneeId
                );
            }

            if (
                latestTask.createdBy &&
                latestTask.createdBy !==
                user.uid
            ) {
                recipients.add(
                    latestTask.createdBy
                );
            }

            recipients.forEach(
                (recipientId) => {
                    const notificationRef =
                        doc(
                            collection(
                                db,
                                "notifications"
                            )
                        );

                    transaction.set(
                        notificationRef,
                        {
                            workspaceId:
                                latestTask.workspaceId,

                            projectId:
                                latestTask.projectId,

                            taskId:
                                task.id,

                            recipientId,

                            actorId:
                                user.uid,

                            actorSnapshot: {
                                displayName,
                                photoURL,
                            },

                            type:
                                "task_commented",

                            metadata: {
                                taskKey:
                                    latestTask.key,

                                taskTitle:
                                    latestTask.title,

                                commentId:
                                    commentRef.id,
                            },

                            isRead: false,

                            createdAt:
                                serverTimestamp(),

                            readAt: null,
                        }
                    );
                }
            );
        }
    );

    return commentRef.id;
}
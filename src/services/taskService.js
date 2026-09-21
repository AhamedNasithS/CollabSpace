import {
    collection,
    doc,
    onSnapshot,
    query,
    runTransaction,
    serverTimestamp,
    Timestamp,
    where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function getActorSnapshot({
    actorName,
    actorPhotoURL,
}) {
    return {
        displayName:
            actorName || "User",

        photoURL:
            actorPhotoURL || null,
    };
}

export function subscribeToProjectTasks({
    workspaceId,
    projectId,
    onData,
    onError,
}) {
    const tasksQuery = query(
        collection(db, "tasks"),
        where(
            "workspaceId",
            "==",
            workspaceId
        ),
        where(
            "projectId",
            "==",
            projectId
        )
    );

    return onSnapshot(
        tasksQuery,
        (snapshot) => {
            const tasks =
                snapshot.docs.map(
                    (taskDoc) => ({
                        id: taskDoc.id,
                        ...taskDoc.data(),
                    })
                );

            tasks.sort(
                (a, b) =>
                    (a.position || 0) -
                    (b.position || 0)
            );

            onData(tasks);
        },
        onError
    );
}

export function subscribeToMyTasks({
    workspaceId,
    userId,
    onData,
    onError,
}) {
    const tasksQuery = query(
        collection(db, "tasks"),
        where(
            "workspaceId",
            "==",
            workspaceId
        ),
        where(
            "assigneeId",
            "==",
            userId
        )
    );

    return onSnapshot(
        tasksQuery,
        (snapshot) => {
            const tasks =
                snapshot.docs.map(
                    (taskDoc) => ({
                        id: taskDoc.id,
                        ...taskDoc.data(),
                    })
                );

            tasks.sort((a, b) => {
                const aCompleted =
                    a.status === "completed";

                const bCompleted =
                    b.status === "completed";

                if (
                    aCompleted !== bCompleted
                ) {
                    return aCompleted ? 1 : -1;
                }

                const aDue =
                    a.dueAt?.seconds ??
                    Number.MAX_SAFE_INTEGER;

                const bDue =
                    b.dueAt?.seconds ??
                    Number.MAX_SAFE_INTEGER;

                if (aDue !== bDue) {
                    return aDue - bDue;
                }

                return (
                    (b.updatedAt?.seconds || 0) -
                    (a.updatedAt?.seconds || 0)
                );
            });

            onData(tasks);
        },
        onError
    );
}

export async function createTask({
    workspaceId,
    projectId,

    userId,
    actorName,
    actorPhotoURL,

    title,
    description = "",

    status = "backlog",
    priority = "medium",

    assigneeId = null,

    dueDate = "",
}) {
    if (!userId) {
        throw new Error(
            "User ID is required to create a task."
        );
    }
    const projectRef = doc(
        db,
        "projects",
        projectId
    );

    const taskRef = doc(
        collection(db, "tasks")
    );

    const activityRef = doc(
        collection(db, "activities")
    );

    const notificationRef =
        assigneeId &&
            assigneeId !== userId
            ? doc(
                collection(
                    db,
                    "notifications"
                )
            )
            : null;



    await runTransaction(
        db,
        async (transaction) => {
            const projectSnapshot =
                await transaction.get(
                    projectRef
                );

            if (
                !projectSnapshot.exists()
            ) {
                throw new Error(
                    "Project not found."
                );
            }

            const project =
                projectSnapshot.data();

            if (
                project.workspaceId !==
                workspaceId
            ) {
                throw new Error(
                    "Invalid workspace."
                );
            }

            const nextSequence =
                (project.taskCounter || 0) +
                1;

            const taskKey =
                `${project.code}-${nextSequence}`;

            let dueAt = null;

            if (dueDate) {
                dueAt =
                    Timestamp.fromDate(
                        new Date(
                            `${dueDate}T23:59:59`
                        )
                    );
            }

            transaction.update(
                projectRef,
                {
                    taskCounter:
                        nextSequence,

                    updatedAt:
                        serverTimestamp(),
                }
            );

            transaction.set(
                taskRef,
                {
                    workspaceId,
                    projectId,

                    key:
                        taskKey,

                    sequence:
                        nextSequence,

                    title,
                    description,

                    status,
                    priority,

                    assigneeId,

                    labels: [],

                    dueAt,

                    position:
                        nextSequence * 1000,

                    commentCount: 0,

                    createdBy:
                        userId,

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),

                    completedAt:
                        status === "completed"
                            ? serverTimestamp()
                            : null,
                }
            );

            transaction.set(
                activityRef,
                {
                    workspaceId,
                    projectId,

                    taskId:
                        taskRef.id,

                    actorId:
                        userId,

                    actorSnapshot:
                        getActorSnapshot({
                            actorName,
                            actorPhotoURL,
                        }),

                    type:
                        "task_created",

                    metadata: {
                        taskKey,
                        taskTitle:
                            title,
                    },

                    createdAt:
                        serverTimestamp(),
                }
            );

            if (notificationRef) {
                transaction.set(
                    notificationRef,
                    {
                        workspaceId,
                        projectId,

                        taskId:
                            taskRef.id,

                        recipientId:
                            assigneeId,

                        actorId:
                            userId,

                        actorSnapshot:
                            getActorSnapshot({
                                actorName,
                                actorPhotoURL,
                            }),

                        type:
                            "task_assigned",

                        metadata: {
                            taskKey,
                            taskTitle:
                                title,
                        },

                        isRead: false,

                        createdAt:
                            serverTimestamp(),

                        readAt: null,
                    }
                );
            }
        }
    );

    return taskRef.id;
}

export async function updateTaskStatus({
    taskId,
    status,

    userId,
    actorName,
    actorPhotoURL,
}) {
    if (!userId) {
        throw new Error(
            "User ID is required to update task status."
        );
    }
    const taskRef = doc(
        db,
        "tasks",
        taskId
    );

    const activityRef = doc(
        collection(
            db,
            "activities"
        )
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

            const task =
                taskSnapshot.data();

            const previousStatus =
                task.status;

            if (
                previousStatus === status
            ) {
                return;
            }

            transaction.update(
                taskRef,
                {
                    status,

                    updatedAt:
                        serverTimestamp(),

                    completedAt:
                        status === "completed"
                            ? serverTimestamp()
                            : null,
                }
            );

            transaction.set(
                activityRef,
                {
                    workspaceId:
                        task.workspaceId,

                    projectId:
                        task.projectId,

                    taskId,

                    actorId:
                        userId,

                    actorSnapshot:
                        getActorSnapshot({
                            actorName,
                            actorPhotoURL,
                        }),

                    type:
                        "task_status_changed",

                    metadata: {
                        taskKey:
                            task.key,

                        taskTitle:
                            task.title,

                        fromStatus:
                            previousStatus,

                        toStatus:
                            status,
                    },

                    createdAt:
                        serverTimestamp(),
                }
            );
        }
    );
}

export async function updateTaskDetails({
    taskId,

    userId,
    actorName,
    actorPhotoURL,

    title,
    description,

    status,
    priority,

    assigneeId,

    dueDate,

    labels,
}) {
    if (!userId) {
        throw new Error(
            "User ID is required to update task details."
        );
    }
    const taskRef = doc(
        db,
        "tasks",
        taskId
    );

    const activityRef = doc(
        collection(
            db,
            "activities"
        )
    );

    let dueAt = null;

    if (dueDate) {
        dueAt =
            Timestamp.fromDate(
                new Date(
                    `${dueDate}T23:59:59`
                )
            );
    }

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

            const currentTask =
                taskSnapshot.data();

            transaction.update(
                taskRef,
                {
                    title,
                    description,

                    status,
                    priority,

                    assigneeId:
                        assigneeId || null,

                    dueAt,

                    labels,

                    updatedAt:
                        serverTimestamp(),

                    completedAt:
                        status === "completed"
                            ? (
                                currentTask.status ===
                                    "completed" &&
                                    currentTask.completedAt
                                    ? currentTask.completedAt
                                    : serverTimestamp()
                            )
                            : null,
                }
            );

            transaction.set(
                activityRef,
                {
                    workspaceId:
                        currentTask.workspaceId,

                    projectId:
                        currentTask.projectId,

                    taskId,

                    actorId:
                        userId,

                    actorSnapshot:
                        getActorSnapshot({
                            actorName,
                            actorPhotoURL,
                        }),

                    type:
                        "task_updated",

                    metadata: {
                        taskKey:
                            currentTask.key,

                        taskTitle:
                            title,

                        previousTitle:
                            currentTask.title,

                        fromStatus:
                            currentTask.status,

                        toStatus:
                            status,

                        fromPriority:
                            currentTask.priority,

                        toPriority:
                            priority,
                    },

                    createdAt:
                        serverTimestamp(),
                }
            );

            if (
                assigneeId &&
                assigneeId !==
                currentTask.assigneeId &&
                assigneeId !== userId
            ) {
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
                            currentTask.workspaceId,

                        projectId:
                            currentTask.projectId,

                        taskId,

                        recipientId:
                            assigneeId,

                        actorId:
                            userId,

                        actorSnapshot:
                            getActorSnapshot({
                                actorName,
                                actorPhotoURL,
                            }),

                        type:
                            "task_assigned",

                        metadata: {
                            taskKey:
                                currentTask.key,

                            taskTitle:
                                title,
                        },

                        isRead: false,

                        createdAt:
                            serverTimestamp(),

                        readAt: null,
                    }
                );
            }
        }
    );
}

export function subscribeToWorkspaceTasks({
  workspaceId,
  onData,
  onError,
}) {
  const tasksQuery = query(
    collection(db, "tasks"),
    where(
      "workspaceId",
      "==",
      workspaceId
    )
  );

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks =
        snapshot.docs.map(
          (taskDoc) => ({
            id: taskDoc.id,
            ...taskDoc.data(),
          })
        );

      tasks.sort(
        (a, b) =>
          (b.updatedAt?.seconds || 0) -
          (a.updatedAt?.seconds || 0)
      );

      onData(tasks);
    },
    onError
  );
}
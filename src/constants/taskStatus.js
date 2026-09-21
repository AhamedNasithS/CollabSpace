export const TASK_STATUS = {
  BACKLOG: "backlog",
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  COMPLETED: "completed",
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.BACKLOG]: "Backlog",
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.REVIEW]: "Review",
  [TASK_STATUS.COMPLETED]: "Completed",
};

export const TASK_STATUS_VARIANTS = {
  [TASK_STATUS.BACKLOG]: "neutral",
  [TASK_STATUS.TODO]: "info",
  [TASK_STATUS.IN_PROGRESS]: "primary",
  [TASK_STATUS.REVIEW]: "warning",
  [TASK_STATUS.COMPLETED]: "success",
};
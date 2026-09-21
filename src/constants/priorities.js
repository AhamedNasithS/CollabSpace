export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: "Low",
  [TASK_PRIORITY.MEDIUM]: "Medium",
  [TASK_PRIORITY.HIGH]: "High",
  [TASK_PRIORITY.URGENT]: "Urgent",
};

export const TASK_PRIORITY_VARIANTS = {
  [TASK_PRIORITY.LOW]: "neutral",
  [TASK_PRIORITY.MEDIUM]: "info",
  [TASK_PRIORITY.HIGH]: "warning",
  [TASK_PRIORITY.URGENT]: "danger",
};
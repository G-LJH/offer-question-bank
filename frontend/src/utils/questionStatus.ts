import type { Question } from "../types/question"

export type QuestionStatus = "unmastered" | "reviewing" | "mastered" | "unset"

export const statusMeta: Record<QuestionStatus, { label: string; className: string }> = {
  unmastered: { label: "未掌握", className: "status-unmastered" },
  reviewing: { label: "复习中", className: "status-reviewing" },
  mastered: { label: "已掌握", className: "status-mastered" },
  unset: { label: "待标记", className: "status-unset" },
}

export function getQuestionStatus(question: Question): QuestionStatus {
  const tagNames = question.tags.map((tag) => tag.name)
  if (tagNames.some((name) => name.includes("未掌握") || name.includes("错题"))) return "unmastered"
  if (tagNames.some((name) => name.includes("复习中") || name.includes("待复习"))) return "reviewing"
  if (tagNames.some((name) => name.includes("已掌握") || name.includes("掌握"))) return "mastered"
  return "unset"
}

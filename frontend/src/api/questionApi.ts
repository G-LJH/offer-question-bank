import { http } from "./http"
import type { Question, QuestionPayload } from "../types/question"

function params(tagIds?: number[]) {
  return tagIds?.length ? { tag_ids: tagIds.join(",") } : undefined
}

export async function getQuestions(tagIds?: number[]) {
  const { data } = await http.get<Question[]>("/api/questions", { params: params(tagIds) })
  return data
}

export async function getQuestionById(id: number) {
  const { data } = await http.get<Question>(`/api/questions/${id}`)
  return data
}

export async function createQuestion(payload: QuestionPayload) {
  const { data } = await http.post<Question>("/api/questions", payload)
  return data
}

export async function updateQuestion(id: number, payload: QuestionPayload) {
  const { data } = await http.put<Question>(`/api/questions/${id}`, payload)
  return data
}

export async function deleteQuestion(id: number) {
  await http.delete(`/api/questions/${id}`)
}

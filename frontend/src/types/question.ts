import type { Tag } from "./tag"

export interface Question {
  id: number
  title: string
  question: string
  answer: string | null
  note: string | null
  source: string | null
  created_at: string
  updated_at: string
  tags: Tag[]
}

export interface QuestionPayload {
  title: string
  question: string
  answer: string
  note: string
  source: string
  tag_ids: number[]
}

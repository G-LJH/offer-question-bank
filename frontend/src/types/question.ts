import type { Tag } from "./tag"

export interface Question {
  id: number
  question: string
  answer: string | null
  note: string | null
  source: string | null
  created_at: string
  updated_at: string
  tags: Tag[]
}

export interface QuestionPayload {
  question: string
  answer: string
  note: string
  source: string
  tag_ids: number[]
}

export interface BulkQuestionItem {
  question: string
  answer?: string
  note?: string
  source?: string
  tags?: string[]
}

export interface BulkQuestionResult {
  created_count: number
  created_tag_count: number
  questions: Question[]
}

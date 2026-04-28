import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getQuestionById, updateQuestion } from "../api/questionApi"
import { getTags } from "../api/tagApi"
import { QuestionForm } from "../components/QuestionForm"
import type { Question, QuestionPayload } from "../types/question"
import type { Tag } from "../types/tag"

export function QuestionEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState<Question | null>(null)
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    if (!id) return
    getQuestionById(Number(id)).then(setQuestion)
    getTags().then(setTags)
  }, [id])

  async function submit(payload: QuestionPayload) {
    if (!id) return
    await updateQuestion(Number(id), payload)
    navigate(`/questions/${id}`)
  }

  if (!question) return <main className="page"><p className="empty">加载中...</p></main>
  return <main className="page"><h1>编辑题目</h1><QuestionForm initialValue={question} tags={tags} onSubmit={submit} /></main>
}

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createQuestion } from "../api/questionApi"
import { getTags } from "../api/tagApi"
import { QuestionForm } from "../components/QuestionForm"
import type { QuestionPayload } from "../types/question"
import type { Tag } from "../types/tag"

export function QuestionCreatePage() {
  const [tags, setTags] = useState<Tag[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getTags().then(setTags)
  }, [])

  async function submit(payload: QuestionPayload) {
    const question = await createQuestion(payload)
    navigate(`/questions/${question.id}`)
  }

  return <main className="page"><h1>新增题目</h1><QuestionForm tags={tags} onSubmit={submit} /></main>
}

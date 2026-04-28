import { Save } from "lucide-react"
import { useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import type { Question, QuestionPayload } from "../types/question"
import type { Tag } from "../types/tag"
import { TagSelector } from "./TagSelector"

interface Props {
  initialValue?: Question
  tags: Tag[]
  onSubmit: (payload: QuestionPayload) => Promise<void>
}

export function QuestionForm({ initialValue, tags, onSubmit }: Props) {
  const [title, setTitle] = useState(initialValue?.title ?? "")
  const [question, setQuestion] = useState(initialValue?.question ?? "")
  const [answer, setAnswer] = useState(initialValue?.answer ?? "")
  const [note, setNote] = useState(initialValue?.note ?? "")
  const [source, setSource] = useState(initialValue?.source ?? "手动录入")
  const [tagIds, setTagIds] = useState<number[]>(initialValue?.tags.map((tag) => tag.id) ?? [])
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    await onSubmit({ title, question, answer, note, source, tag_ids: tagIds })
    setSaving(false)
  }

  return (
    <form className="form" onSubmit={submit}>
      <label>标题<input required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label>问题<textarea required rows={6} value={question} onChange={(event) => setQuestion(event.target.value)} /></label>
      <label>答案<textarea rows={7} value={answer} onChange={(event) => setAnswer(event.target.value)} /></label>
      <label>笔记<textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} /></label>
      <label>来源<input value={source} onChange={(event) => setSource(event.target.value)} /></label>
      <div>
        <p className="field-title">标签</p>
        <TagSelector tags={tags} selectedIds={tagIds} onChange={setTagIds} />
      </div>
      <div className="form-actions">
        <Link className="secondary-btn" to="/">取消</Link>
        <button className="primary-btn" disabled={saving}><Save size={16} />{saving ? "保存中" : "保存"}</button>
      </div>
    </form>
  )
}

import { Link } from "react-router-dom"
import { Edit3, Trash2 } from "lucide-react"
import type { Question } from "../types/question"
import { AnswerToggle } from "./AnswerToggle"
import { TagBadge } from "./TagBadge"
import { getQuestionStatus, statusMeta } from "../utils/questionStatus"

interface Props {
  question: Question
  onDelete: (question: Question) => void
  compact?: boolean
}

export function QuestionCard({ question, onDelete, compact }: Props) {
  const status = statusMeta[getQuestionStatus(question)]

  return (
    <article className={compact ? "question-card compact-card" : "question-card"}>
      <div className="card-head">
        <div>
          <div className="title-row">
            <h3>{question.title}</h3>
            <span className={`status-pill ${status.className}`}>{status.label}</span>
          </div>
          <p className="muted">更新于 {new Date(question.updated_at).toLocaleString()}</p>
        </div>
        <div className="card-actions">
          <Link className="secondary-btn" to={`/questions/${question.id}`}>查看</Link>
          <Link className="icon-btn" to={`/questions/${question.id}/edit`} title="编辑"><Edit3 size={16} /></Link>
          <button className="icon-btn danger-icon" onClick={() => onDelete(question)} title="删除"><Trash2 size={16} /></button>
        </div>
      </div>
      <p className="question-text">{question.question}</p>
      <div className="tag-row">
        {question.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
      </div>
      {!compact && <AnswerToggle answer={question.answer} />}
    </article>
  )
}

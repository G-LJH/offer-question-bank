import { Link } from "react-router-dom"
import { CalendarClock, Edit3, ExternalLink, Library, Trash2 } from "lucide-react"
import type { Question } from "../types/question"
import { AnswerToggle } from "./AnswerToggle"
import { MarkdownContent } from "./MarkdownContent"
import { TagBadge } from "./TagBadge"

interface Props {
  question: Question
  onDelete: (question: Question) => void
}

export function QuestionCard({ question, onDelete }: Props) {
  const previewTitle = question.question.split("\n")[0] || "未填写问题"
  const updatedAt = new Date(question.updated_at).toLocaleString()

  return (
    <article className="question-card">
      <div className="card-head">
        <div className="question-heading">
          <div className="question-index">#{question.id}</div>
          <div className="title-row">
            <h3>{previewTitle}</h3>
            <div className="question-meta">
              {question.source && (
                <span><Library size={14} />{question.source}</span>
              )}
              <span><CalendarClock size={14} />{updatedAt}</span>
            </div>
          </div>
        </div>
        <div className="card-actions">
          <Link className="secondary-btn" to={`/questions/${question.id}`}><ExternalLink size={15} />查看</Link>
          <Link className="icon-btn" to={`/questions/${question.id}/edit`} title="编辑"><Edit3 size={16} /></Link>
          <button className="icon-btn danger-icon" onClick={() => onDelete(question)} title="删除"><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="question-text">
        <MarkdownContent>{question.question}</MarkdownContent>
      </div>
      {question.tags.length > 0 && (
        <div className="tag-row">
          {question.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
        </div>
      )}
      <AnswerToggle answer={question.answer} />
    </article>
  )
}

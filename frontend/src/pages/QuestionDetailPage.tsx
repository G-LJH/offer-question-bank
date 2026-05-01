import { Edit3, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { deleteQuestion, getQuestionById } from "../api/questionApi"
import { AnswerToggle } from "../components/AnswerToggle"
import { ConfirmDialog } from "../components/ConfirmDialog"
import { MarkdownContent } from "../components/MarkdownContent"
import { TagBadge } from "../components/TagBadge"
import type { Question } from "../types/question"

export function QuestionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState<Question | null>(null)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (id) getQuestionById(Number(id)).then(setQuestion)
  }, [id])

  async function remove() {
    if (!question) return
    await deleteQuestion(question.id)
    navigate("/")
  }

  if (!question) return <main className="page"><p className="empty">加载中...</p></main>

  return (
    <main className="page detail-page">
      <div className="detail-head">
        <div>
          <Link className="text-btn" to="/">返回列表</Link>
          <h1>题目详情</h1>
          <div className="tag-row">{question.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}</div>
        </div>
        <div className="top-actions">
          <Link className="secondary-btn" to={`/questions/${question.id}/edit`}><Edit3 size={16} />编辑</Link>
          <button className="danger-btn" onClick={() => setConfirming(true)}><Trash2 size={16} />删除</button>
        </div>
      </div>
      <section className="detail-section"><h2>问题</h2><MarkdownContent>{question.question}</MarkdownContent></section>
      <section className="detail-section"><h2>答案</h2><AnswerToggle answer={question.answer} /></section>
      <section className="detail-section"><h2>笔记</h2><MarkdownContent emptyText="暂无笔记">{question.note}</MarkdownContent></section>
      <section className="meta">来源：{question.source || "未填写"} · 创建于 {new Date(question.created_at).toLocaleString()} · 更新于 {new Date(question.updated_at).toLocaleString()}</section>
      {confirming && <ConfirmDialog title="删除题目" message="确认删除这道题目？" onCancel={() => setConfirming(false)} onConfirm={remove} />}
    </main>
  )
}

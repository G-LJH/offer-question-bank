import { BookOpenCheck, CircleAlert, Clock3, Tags } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getQuestions } from "../api/questionApi"
import { QuestionCard } from "../components/QuestionCard"
import type { Question } from "../types/question"
import { getQuestionStatus } from "../utils/questionStatus"

export function ReviewDashboardPage() {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    getQuestions().then(setQuestions)
  }, [])

  const stats = useMemo(() => {
    return questions.reduce(
      (acc, question) => {
        acc[getQuestionStatus(question)] += 1
        return acc
      },
      { unmastered: 0, reviewing: 0, mastered: 0, unset: 0 },
    )
  }, [questions])

  const priorityQuestions = questions
    .filter((question) => ["unmastered", "reviewing", "unset"].includes(getQuestionStatus(question)))
    .slice(0, 6)

  return (
    <main className="content review-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">复习面板</p>
          <h1>今天先看这些</h1>
          <p>优先展示未掌握、复习中和待标记的题目，减少翻找成本。</p>
        </div>
        <Link className="primary-btn" to="/">进入题目库</Link>
      </header>

      <section className="metric-grid">
        <div className="metric-card danger-metric"><CircleAlert size={20} /><strong>{stats.unmastered}</strong><span>未掌握</span></div>
        <div className="metric-card warning-metric"><Clock3 size={20} /><strong>{stats.reviewing}</strong><span>复习中</span></div>
        <div className="metric-card success-metric"><BookOpenCheck size={20} /><strong>{stats.mastered}</strong><span>已掌握</span></div>
        <div className="metric-card neutral-metric"><Tags size={20} /><strong>{stats.unset}</strong><span>待标记</span></div>
      </section>

      <section className="review-layout">
        <div>
          <h2>优先复习</h2>
          <div className="question-list compact-list">
            {priorityQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} onDelete={() => undefined} compact />
            ))}
            {!priorityQuestions.length && <p className="empty compact">暂无需要优先复习的题目。</p>}
          </div>
        </div>
        <aside className="review-guide">
          <h2>推荐标签</h2>
          <p>给题目加上这些标签后，复习面板会自动归类。</p>
          <div className="guide-tags">
            <span>未掌握</span>
            <span>复习中</span>
            <span>已掌握</span>
            <span>高频</span>
            <span>面试常问</span>
          </div>
        </aside>
      </section>
    </main>
  )
}

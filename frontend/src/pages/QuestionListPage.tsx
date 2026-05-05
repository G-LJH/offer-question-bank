import { Download, Plus, Search, SlidersHorizontal, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { deleteQuestion, getQuestions } from "../api/questionApi"
import { exportQuestions } from "../api/exportApi"
import { getTags } from "../api/tagApi"
import { ConfirmDialog } from "../components/ConfirmDialog"
import { QuestionCard } from "../components/QuestionCard"
import { TagBadge } from "../components/TagBadge"
import type { Question } from "../types/question"
import type { Tag } from "../types/tag"

export function QuestionListPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [tagQuery, setTagQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState<Question | null>(null)

  async function loadQuestions(ids = selectedIds) {
    setLoading(true)
    setQuestions(await getQuestions(ids))
    setLoading(false)
  }

  useEffect(() => {
    let ignore = false
    getTags().then((items) => {
      if (!ignore) setTags(items)
    })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
    getQuestions(selectedIds).then((items) => {
      if (ignore) return
      setQuestions(items)
      setLoading(false)
    })
    return () => {
      ignore = true
    }
  }, [selectedIds])

  function toggleTag(id: number) {
    setSelectedIds((value) => (value.includes(id) ? value.filter((item) => item !== id) : [...value, id]))
  }

  const filteredTags = useMemo(
    () => tags.filter((tag) => tag.name.toLowerCase().includes(tagQuery.trim().toLowerCase())),
    [tags, tagQuery],
  )

  const selectedTags = tags.filter((tag) => selectedIds.includes(tag.id))

  async function confirmDelete() {
    if (!pendingDelete) return
    await deleteQuestion(pendingDelete.id)
    setPendingDelete(null)
    loadQuestions()
  }

  return (
    <main className="content question-workbench">
      <header className="topbar">
        <div>
          <p className="eyebrow">题目库</p>
          <h1>Offer 题库助手</h1>
          <p>整理面试题、隐藏答案复习、按标签组合筛选。</p>
        </div>
        <div className="top-actions">
          <button className="secondary-btn" onClick={() => exportQuestions(selectedIds)}><Download size={16} />导出</button>
          <Link className="primary-btn" to="/questions/new"><Plus size={16} />新增题目</Link>
        </div>
      </header>

      <section className="filter-dock">
        <div className="filter-summary">
          <SlidersHorizontal size={18} />
          <div>
            <strong>标签筛选</strong>
            <span>已选择 {selectedIds.length} 个标签，匹配 {questions.length} 道题</span>
          </div>
        </div>
        <label className="search-box"><Search size={16} /><input value={tagQuery} onChange={(event) => setTagQuery(event.target.value)} placeholder="搜索标签后筛选" /></label>
        {selectedTags.length > 0 && (
          <div className="selected-filter-row">
            {selectedTags.map((tag) => (
              <button key={tag.id} className="selected-chip" onClick={() => toggleTag(tag.id)}>
                {tag.name}<X size={14} />
              </button>
            ))}
            <button className="text-btn" onClick={() => setSelectedIds([])}>清空</button>
          </div>
        )}
        <div className="tag-filter-cloud">
          {filteredTags.map((tag) => <TagBadge key={tag.id} tag={tag} active={selectedIds.includes(tag.id)} onClick={() => toggleTag(tag.id)} />)}
          {!filteredTags.length && <span className="muted">没有匹配的标签</span>}
        </div>
      </section>

      {loading ? <p className="empty">加载中...</p> : null}
      {!loading && questions.length === 0 ? <p className="empty">暂无题目，先新增一道面试题。</p> : null}
      <div className="question-list">
        {questions.map((item) => <QuestionCard key={item.id} question={item} onDelete={setPendingDelete} />)}
      </div>
      {pendingDelete && (
        <ConfirmDialog title="删除题目" message="确认删除这道题目？" onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />
      )}
    </main>
  )
}

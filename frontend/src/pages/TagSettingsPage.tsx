import { Plus, Search, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { createTag, deleteTag, getTags } from "../api/tagApi"
import { getQuestions } from "../api/questionApi"
import type { Question } from "../types/question"
import type { Tag } from "../types/tag"

const palette = ["#2563eb", "#059669", "#dc2626", "#7c3aed", "#ca8a04", "#0f766e", "#be123c", "#4b5563", "#ea580c", "#0891b2"]

export function TagSettingsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [name, setName] = useState("")
  const [color, setColor] = useState(palette[0])
  const [query, setQuery] = useState("")
  const [error, setError] = useState("")

  async function load() {
    const [nextTags, nextQuestions] = await Promise.all([getTags(), getQuestions()])
    setTags(nextTags)
    setQuestions(nextQuestions)
  }

  useEffect(() => {
    load()
  }, [])

  const usage = useMemo(() => {
    const map = new Map<number, number>()
    questions.forEach((question) => question.tags.forEach((tag) => map.set(tag.id, (map.get(tag.id) ?? 0) + 1)))
    return map
  }, [questions])

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(query.trim().toLowerCase()))

  async function submit() {
    if (!name.trim()) return
    try {
      await createTag({ name: name.trim(), color })
      setName("")
      setError("")
      load()
    } catch {
      setError("标签创建失败，可能已存在")
    }
  }

  async function remove(tag: Tag) {
    const count = usage.get(tag.id) ?? 0
    if (!window.confirm(`确认删除「${tag.name}」？当前有 ${count} 道题使用它，题目本身不会删除。`)) return
    await deleteTag(tag.id)
    load()
  }

  return (
    <main className="content settings-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">配置</p>
          <h1>标签配置</h1>
          <p>适合大量标签的集中管理，先搜索，再清理低频或重复标签。</p>
        </div>
        <div className="stat-strip">
          <div><strong>{tags.length}</strong><span>标签</span></div>
          <div><strong>{questions.length}</strong><span>题目</span></div>
        </div>
      </header>

      <section className="settings-grid">
        <div className="settings-panel">
          <h2>创建标签</h2>
          <div className="create-tag-box">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：React / 高频 / 未掌握" />
            <button className="primary-btn" onClick={submit}><Plus size={16} />创建</button>
          </div>
          <div className="swatches">
            {palette.map((item) => (
              <button key={item} className={item === color ? "swatch active" : "swatch"} style={{ backgroundColor: item }} onClick={() => setColor(item)} title={item} />
            ))}
          </div>
          {error && <p className="error">{error}</p>}
        </div>

        <div className="settings-panel tag-admin-panel">
          <div className="panel-head">
            <h2>全部标签</h2>
            <label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标签" /></label>
          </div>
          <div className="tag-table">
            {filteredTags.map((tag) => (
              <div className="tag-table-row" key={tag.id}>
                <div className="tag-name-cell"><i style={{ backgroundColor: tag.color }} /> <span>{tag.name}</span></div>
                <span className="usage-pill">{usage.get(tag.id) ?? 0} 题</span>
                <button className="tiny-btn danger-icon" onClick={() => remove(tag)} title="删除标签"><Trash2 size={15} /></button>
              </div>
            ))}
            {!filteredTags.length && <p className="empty compact">没有匹配的标签。</p>}
          </div>
        </div>
      </section>
    </main>
  )
}

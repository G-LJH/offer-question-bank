import { Download, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { exportQuestions } from "../api/exportApi"
import { getQuestions } from "../api/questionApi"
import { getTags } from "../api/tagApi"
import { TagBadge } from "../components/TagBadge"
import type { Tag } from "../types/tag"

export function ExportCenterPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    getTags().then(setTags)
  }, [])

  useEffect(() => {
    getQuestions(selectedIds).then((items) => setCount(items.length))
  }, [selectedIds])

  function toggle(id: number) {
    setSelectedIds((value) => (value.includes(id) ? value.filter((item) => item !== id) : [...value, id]))
  }

  return (
    <main className="content export-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">导出中心</p>
          <h1>整理成 Markdown</h1>
          <p>可以导出全部题目，也可以先按标签组合筛选后导出。</p>
        </div>
      </header>

      <section className="export-panel">
        <div className="export-card">
          <FileText size={28} />
          <h2>Markdown 题库</h2>
          <p>当前将导出 {count} 道题，文件名为 offer-question-bank.md。</p>
          <button className="primary-btn" onClick={() => exportQuestions(selectedIds)}><Download size={16} />导出 Markdown</button>
        </div>
        <div className="settings-panel">
          <h2>按标签筛选</h2>
          <div className="tag-filter-cloud export-tags">
            {tags.map((tag) => <TagBadge key={tag.id} tag={tag} active={selectedIds.includes(tag.id)} onClick={() => toggle(tag.id)} />)}
          </div>
          {selectedIds.length > 0 && <button className="text-btn" onClick={() => setSelectedIds([])}>清空筛选</button>}
        </div>
      </section>
    </main>
  )
}

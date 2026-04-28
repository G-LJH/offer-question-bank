import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { createTag, deleteTag } from "../api/tagApi"
import type { Tag } from "../types/tag"

const palette = ["#2563eb", "#059669", "#dc2626", "#7c3aed", "#ca8a04", "#0f766e", "#be123c"]

interface Props {
  tags: Tag[]
  onChange: () => void
}

export function TagManager({ tags, onChange }: Props) {
  const [name, setName] = useState("")
  const [color, setColor] = useState(palette[0])
  const [error, setError] = useState("")

  async function submit() {
    if (!name.trim()) return
    try {
      await createTag({ name: name.trim(), color })
      setName("")
      setError("")
      onChange()
    } catch {
      setError("标签创建失败，可能已存在")
    }
  }

  async function remove(id: number) {
    if (!window.confirm("确认删除这个标签？题目不会被删除。")) return
    await deleteTag(id)
    onChange()
  }

  return (
    <section className="side-section">
      <h2>标签管理</h2>
      <div className="tag-form">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="新标签" />
        <button className="icon-btn" type="button" onClick={submit} title="创建标签"><Plus size={18} /></button>
      </div>
      <div className="swatches">
        {palette.map((item) => (
          <button key={item} className={item === color ? "swatch active" : "swatch"} style={{ backgroundColor: item }} onClick={() => setColor(item)} />
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="tag-list">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-list-item">
            <span><i style={{ backgroundColor: tag.color }} />{tag.name}</span>
            <button className="tiny-btn" onClick={() => remove(tag.id)} title="删除标签"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </section>
  )
}

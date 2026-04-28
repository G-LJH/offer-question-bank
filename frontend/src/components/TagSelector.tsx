import type { Tag } from "../types/tag"
import { TagBadge } from "./TagBadge"

interface Props {
  tags: Tag[]
  selectedIds: number[]
  onChange: (ids: number[]) => void
}

export function TagSelector({ tags, selectedIds, onChange }: Props) {
  function toggle(id: number) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  }

  return (
    <div className="tag-row">
      {tags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} active={selectedIds.includes(tag.id)} onClick={() => toggle(tag.id)} />
      ))}
      {!tags.length && <span className="muted">暂无标签，先在首页创建</span>}
    </div>
  )
}

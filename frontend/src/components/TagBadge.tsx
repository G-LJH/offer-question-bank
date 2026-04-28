import type { Tag } from "../types/tag"

interface Props {
  tag: Tag
  active?: boolean
  onClick?: () => void
}

export function TagBadge({ tag, active, onClick }: Props) {
  const style = active
    ? { backgroundColor: tag.color, borderColor: tag.color, color: "#fff" }
    : { borderColor: tag.color, color: tag.color }

  return (
    <button type="button" className="tag-badge" style={style} onClick={onClick}>
      {tag.name}
    </button>
  )
}

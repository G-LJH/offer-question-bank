import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Props {
  children?: string | null
  emptyText?: string
}

export function MarkdownContent({ children, emptyText = "暂无内容" }: Props) {
  const content = children?.trim() || emptyText

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface Props {
  answer?: string | null
}

export function AnswerToggle({ answer }: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="answer-box">
      <button className="ghost-btn" type="button" onClick={() => setVisible((value) => !value)}>
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        {visible ? "隐藏答案" : "显示答案"}
      </button>
      {visible ? <p className="whitespace-pre-wrap">{answer || "暂无答案"}</p> : <p className="muted">答案已隐藏</p>}
    </div>
  )
}

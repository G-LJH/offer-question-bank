import { Clipboard, Save } from "lucide-react"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { createQuestion, createQuestionsBulk } from "../api/questionApi"
import { getTags } from "../api/tagApi"
import { QuestionForm } from "../components/QuestionForm"
import type { BulkQuestionItem, BulkQuestionResult, QuestionPayload } from "../types/question"
import type { Tag } from "../types/tag"

const template = `[
  {
    "question": "请解释 JavaScript 闭包是什么？",
    "answer": "闭包是函数和其词法作用域的组合。\\n\\n- 可以访问外层函数变量\\n- 常用于封装状态、函数工厂",
    "note": "回答时最好结合具体业务例子。",
    "source": "前端面试",
    "tags": ["JavaScript", "闭包", "前端"]
  },
  {
    "题目": "React 中 useEffect 的依赖数组有什么作用？",
    "答案": "依赖数组用于控制 effect 重新执行的时机。",
    "笔记": "注意空数组、无数组、指定依赖三种情况。",
    "标签": ["React", "Hooks"]
  }
]`

function normalizeItems(value: unknown): BulkQuestionItem[] {
  const items = Array.isArray(value) ? value : [value]

  return items.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("每一项都必须是对象")
    }

    const record = item as Record<string, unknown>
    const question = record.question ?? record["题目"]
    const answer = record.answer ?? record["答案"] ?? ""
    const note = record.note ?? record["笔记"] ?? ""
    const source = record.source ?? record["来源"] ?? "批量导入"
    const tags = record.tags ?? record["标签"] ?? []

    if (typeof question !== "string" || !question.trim()) {
      throw new Error("每道题都需要填写 question 或 题目")
    }

    if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
      throw new Error("tags/标签 必须是字符串数组")
    }

    return {
      question,
      answer: typeof answer === "string" ? answer : String(answer),
      note: typeof note === "string" ? note : String(note),
      source: typeof source === "string" ? source : String(source),
      tags,
    }
  })
}

export function QuestionCreatePage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [jsonText, setJsonText] = useState(template)
  const [savingBulk, setSavingBulk] = useState(false)
  const [bulkError, setBulkError] = useState("")
  const [bulkResult, setBulkResult] = useState<BulkQuestionResult | null>(null)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get("mode") === "bulk" ? "bulk" : "single"

  useEffect(() => {
    let ignore = false
    getTags().then((items) => {
      if (!ignore) setTags(items)
    })
    return () => {
      ignore = true
    }
  }, [])

  async function submit(payload: QuestionPayload) {
    const question = await createQuestion(payload)
    navigate(`/questions/${question.id}`)
  }

  function switchMode(nextMode: "single" | "bulk") {
    setSearchParams(nextMode === "bulk" ? { mode: "bulk" } : {})
  }

  async function submitBulk(event: FormEvent) {
    event.preventDefault()
    setBulkError("")
    setBulkResult(null)

    let items: BulkQuestionItem[]
    try {
      items = normalizeItems(JSON.parse(jsonText))
    } catch (err) {
      setBulkError(err instanceof Error ? err.message : "JSON 格式不正确")
      return
    }

    setSavingBulk(true)
    try {
      setBulkResult(await createQuestionsBulk(items))
    } catch {
      setBulkError("导入失败，请检查字段格式或后端服务状态。")
    } finally {
      setSavingBulk(false)
    }
  }

  return (
    <main className="page create-page">
      <div className="topbar">
        <div>
          <p className="eyebrow">添加题目</p>
          <h1>新增题目</h1>
          <p>单题录入适合精修内容，批量导入适合一次整理多道题。</p>
        </div>
        <Link className="secondary-btn" to="/">返回题目库</Link>
      </div>

      <div className="mode-tabs">
        <button className={mode === "single" ? "active" : ""} onClick={() => switchMode("single")}>单题录入</button>
        <button className={mode === "bulk" ? "active" : ""} onClick={() => switchMode("bulk")}>批量导入</button>
      </div>

      {mode === "single" ? (
        <QuestionForm tags={tags} onSubmit={submit} />
      ) : (
        <div className="bulk-layout">
          <form className="form bulk-form" onSubmit={submitBulk}>
            <div className="field-head">
              <p className="field-title">JSON 内容</p>
              <button className="ghost-btn" type="button" onClick={() => setJsonText(template)}>
                <Clipboard size={16} />填入模板
              </button>
            </div>
            <textarea
              className="json-editor"
              value={jsonText}
              spellCheck={false}
              onChange={(event) => setJsonText(event.target.value)}
            />
            {bulkError && <p className="error">{bulkError}</p>}
            {bulkResult && (
              <p className="success-message">
                已导入 {bulkResult.created_count} 道题，新建 {bulkResult.created_tag_count} 个标签。
              </p>
            )}
            <div className="form-actions">
              <button className="primary-btn" disabled={savingBulk}>
                <Save size={16} />{savingBulk ? "导入中" : "开始导入"}
              </button>
            </div>
          </form>

          <aside className="settings-panel import-guide">
            <h2>说明模板</h2>
            <p>推荐使用英文字段，也兼容中文字段。</p>
            <dl>
              <dt>question / 题目</dt>
              <dd>必填，支持 Markdown。</dd>
              <dt>answer / 答案</dt>
              <dd>可选，支持 Markdown。</dd>
              <dt>note / 笔记</dt>
              <dd>可选，支持 Markdown。</dd>
              <dt>source / 来源</dt>
              <dd>可选，默认是“批量导入”。</dd>
              <dt>tags / 标签</dt>
              <dd>可选，字符串数组；不存在的标签会自动创建。</dd>
            </dl>
          </aside>
        </div>
      )}
    </main>
  )
}

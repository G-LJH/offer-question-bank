import { http } from "./http"

export async function exportQuestions(tagIds?: number[]) {
  const { data } = await http.get("/api/export/questions.md", {
    params: tagIds?.length ? { tag_ids: tagIds.join(",") } : undefined,
    responseType: "blob",
  })
  const url = URL.createObjectURL(data)
  const link = document.createElement("a")
  link.href = url
  link.download = "offer-question-bank.md"
  link.click()
  URL.revokeObjectURL(url)
}

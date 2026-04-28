import { http } from "./http"
import type { Tag, TagCreate } from "../types/tag"

export async function getTags() {
  const { data } = await http.get<Tag[]>("/api/tags")
  return data
}

export async function createTag(payload: TagCreate) {
  const { data } = await http.post<Tag>("/api/tags", payload)
  return data
}

export async function deleteTag(id: number) {
  await http.delete(`/api/tags/${id}`)
}

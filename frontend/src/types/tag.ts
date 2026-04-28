export interface Tag {
  id: number
  name: string
  color: string
  created_at: string
}

export interface TagCreate {
  name: string
  color: string
}

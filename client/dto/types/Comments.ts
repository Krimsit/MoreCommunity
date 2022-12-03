export type Comment = {
  id: number
  username: string
  content: string
  createdAt: string
  avatar: string
}

export interface PostComment {
  content: string
}

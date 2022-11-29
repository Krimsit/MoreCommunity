export type Post = {
  id: number
  title: string
  content: string
  likes: number
  comments: number
  createdAt: string
  isMyLike?: boolean
  communityId: number
}

export type Like = {
  followed: boolean
  count: number
}

export interface Post {
  id: number
  title: string
  content: string
  likes: number
  comments: number
  createdAt: string
  isMyLike?: boolean
  communityId: number
}

export interface PostPost {
  id?: number
  title: string
  content: string
}

export interface Like {
  followed: boolean
  count: number
}

export type Delete = boolean

export type Community = {
  id: number
  avatar: string
  banner?: string
  name: string
  description: string
  followers: number
  keywords: string[]
  isStreamOnline?: boolean
  isMyLike?: boolean
}

export type Follow = {
  followed: boolean
  count: number
}

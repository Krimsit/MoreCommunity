export type Community = {
  id: number
  avatar: string
  banner?: string
  name: string
  description: string
  followers: number
  keywords: string[]
  isStreamOnline?: boolean
  isMyFollow?: boolean
  isOwner?: boolean
}

export interface PostCommunity {
  id?: number
  avatar: string
  banner?: string
  name: string
  description: string
  keywords: string[]
}

export type Follow = {
  isMyFollow: boolean
  count: number
}

export type Delete = boolean

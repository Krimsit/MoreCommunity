import { PostPost } from "dto/types/Posts"
import { File } from "dto/types/Files"

export interface CreatePostProps {
  open: boolean
  onClose: () => void
  communityId: number
  communityName: string
  postId?: number
  initialValues?: PostPost & { files?: File[] }
}

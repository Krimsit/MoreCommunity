import { PostPost } from "dto/types/Posts"
import { File } from "dto/types/Files"

export interface CreatePostProps {
  open: boolean
  onClose: () => void
  communityId: number
  postId?: number
  initialValues?: PostPost & { files?: File[] }
  onSuccess: () => void
}

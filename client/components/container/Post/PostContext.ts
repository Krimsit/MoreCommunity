import { createContext } from "react"

import { PostContextProps } from "./Post.interface"

const PostContext = createContext<PostContextProps>({
  communityId: 0,
  communityName: "",
  postId: 0,
  isOwner: false
})

export default PostContext

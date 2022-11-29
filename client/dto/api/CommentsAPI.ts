import { AxiosResponse } from "axios"

import { api } from "@core"

import { Comment, PostComment } from "dto/types/Comments"
import { Response } from "types/default"

const _api = {
  getAll: (communityId: number, postId: number): Promise<Response<Comment[]>> =>
    api
      .get(`/communities/${communityId}/posts/${postId}/comments`)
      .then((res: AxiosResponse<Response<Comment[]>>) => res.data),
  getLast: (
    communityId: number,
    postId: number
  ): Promise<Response<Comment[]>> =>
    api
      .get(`/communities/${communityId}/posts/${postId}/comments/last`)
      .then((res: AxiosResponse<Response<Comment[]>>) => res.data),
  create: (
    communityId: number,
    postId: number,
    data: PostComment
  ): Promise<Response<Comment>> =>
    api
      .post(`/communities/${communityId}/posts/${postId}/comments`, data)
      .then((res: AxiosResponse<Response<Comment>>) => res.data)
}

export default _api

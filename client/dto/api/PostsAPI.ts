import { AxiosResponse } from "axios"

import { api } from "@core"

import { Post, Like } from "dto/types/Posts"
import { Response } from "types/default"

const _api = {
  getAll: (communityId: number): Promise<Response<Post[]>> =>
    api
      .get(`/communities/${communityId}/posts`)
      .then((res: AxiosResponse<Response<Post[]>>) => res.data),
  getById: (communityId: number, postId: number): Promise<Response<Post>> =>
    api
      .get(`/communities/${communityId}/posts/${postId}`)
      .then((res: AxiosResponse<Response<Post>>) => res.data),
  follow: (communityId: number, postId: number): Promise<Response<Like>> =>
    api
      .post(`/communities/${communityId}/posts/${postId}/like`)
      .then((res: AxiosResponse<Response<Like>>) => res.data)
}

export default _api

import { AxiosResponse } from "axios"

import { api } from "@core"

import { Post, Like, PostPost, Delete } from "dto/types/Posts"
import { Response } from "types/default"

const _api = {
  getAll: (communityId: number): Promise<Response<Post[]>> =>
    api
      .get(`/communities/${communityId}/posts`)
      .then((res: AxiosResponse<Response<Post[]>>) => res.data),
  create: (data: PostPost, communityId: number): Promise<Response<Post>> =>
    api
      .post(`/communities/${communityId}/posts`, data)
      .then((res: AxiosResponse<Response<Post>>) => res.data),
  getById: (communityId: number, postId: number): Promise<Response<Post>> =>
    api
      .get(`/communities/${communityId}/posts/${postId}`)
      .then((res: AxiosResponse<Response<Post>>) => res.data),
  update: (
    data: PostPost,
    communityId: number,
    postId: number
  ): Promise<Response<Post>> =>
    api
      .put(`/communities/${communityId}/posts/${postId}`, data)
      .then((res: AxiosResponse<Response<Post>>) => res.data),
  delete: (communityId: number, postId: number): Promise<Response<Delete>> =>
    api
      .delete(`/communities/${communityId}/posts/${postId}`)
      .then((res: AxiosResponse<Response<Delete>>) => res.data),
  like: (communityId: number, postId: number): Promise<Response<Like>> =>
    api
      .post(`/communities/${communityId}/posts/${postId}/like`)
      .then((res: AxiosResponse<Response<Like>>) => res.data)
}

export default _api

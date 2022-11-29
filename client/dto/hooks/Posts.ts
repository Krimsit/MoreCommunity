import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query"

import postsAPI from "dto/api/PostsAPI"

import { Post, Like } from "dto/types/Posts"
import { Response } from "types/default"

export const useAll = (
  communityId: number,
  enabled: boolean
): UseQueryResult<Post[]> => {
  return useQuery<Response<Post[]>, Error, Post[]>(
    [`community_${communityId}`, "posts_all"],
    () => postsAPI.getAll(communityId),
    {
      select: (response) => response.data,
      enabled: !!communityId && enabled
    }
  )
}

export const useById = (
  communityId: number,
  postId: number
): UseQueryResult<Post> =>
  useQuery<Response<Post>, Error, Post>(
    [`community_${communityId}`, `post_${postId}`],
    () => postsAPI.getById(communityId, postId),
    {
      select: (response) => response.data,
      enabled: !!communityId && !!postId
    }
  )

export const useLike = (
  communityId: number,
  postId: number
): UseMutationResult<Like, Error, void> =>
  useMutation<Like, Error, void>(
    [`community_${communityId}`, `post_${postId}`, "like"],
    () => postsAPI.follow(communityId, postId).then((response) => response.data)
  )

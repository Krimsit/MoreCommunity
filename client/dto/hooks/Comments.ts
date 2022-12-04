import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query"

import commentsAPI from "dto/api/CommentsAPI"
import { Response } from "types/default"

import { Comment, PostComment } from "dto/types/Comments"

export const useAll = (
  communityId: number,
  postId: number
): UseQueryResult<Comment[]> =>
  useQuery<Response<Comment[]>, Error, Comment[]>(
    [`community_${communityId}`, `post_${postId}`, "comments_all"],
    () => commentsAPI.getAll(communityId, postId),
    {
      select: (response) => response.data,
      enabled: !!communityId && !!postId
    }
  )

export const useLast = (
  communityId: number,
  postId: number
): UseQueryResult<Comment[]> =>
  useQuery<Response<Comment[]>, Error, Comment[]>(
    [`community_${communityId}`, `post_${postId}`, "comments_last"],
    () => commentsAPI.getLast(communityId, postId),
    {
      select: (response) => response.data,
      enabled: !!communityId && !!postId
    }
  )

export const useCreate = (
  communityId: number,
  postId: number
): UseMutationResult<Comment, Error, PostComment> =>
  useMutation<Comment, Error, PostComment>(
    [`community_${communityId}`, `post_${postId}`, "create"],
    (data) =>
      commentsAPI
        .create(communityId, postId, data)
        .then((response) => response.data)
  )

import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query"

import postsAPI from "dto/api/PostsAPI"

import { Post, Like, PostPost, Delete } from "dto/types/Posts"
import { Response } from "types/default"
import { AxiosError } from "axios"
import { File } from "dto/types/Files"

export const useAll = (
  communityId: number,
  enabled: boolean
): UseQueryResult<Post[]> => {
  return useQuery<Response<Post[]>, Error, Post[]>(
    [`community_${communityId}`, "posts"],
    () => postsAPI.getAll(communityId),
    {
      select: (response) => response.data,
      enabled: !!communityId && enabled
    }
  )
}

export const useCreate = (
  communityId: number
): UseMutationResult<Post, { [key: string]: string }, PostPost> =>
  useMutation<Post, { [key: string]: string }, PostPost>(
    [`community_${communityId}`, "post", "create"],
    (data) =>
      postsAPI
        .create(data, communityId)
        .then((response) => response.data)
        .catch((error: AxiosError<Response<{ [key: string]: string }>>) =>
          Promise.reject(error?.response?.data.data)
        )
  )

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

export const useUpdate = (
  communityId: number,
  postId: number
): UseMutationResult<Post, { [key: string]: string }, PostPost> =>
  useMutation<Post, { [key: string]: string }, PostPost>(
    [`community_${communityId}`, `post_${postId}`, "update"],
    (data) =>
      postsAPI
        .update(data, communityId, postId)
        .then((response) => response.data)
        .catch((error: AxiosError<Response<{ [key: string]: string }>>) =>
          Promise.reject(error?.response?.data.data)
        )
  )

export const useDelete = (
  communityId: number,
  postId: number
): UseMutationResult<Delete, Error, void> =>
  useMutation<Delete, Error, void>(
    [`community_${communityId}`, `post_${postId}`, "delete"],
    () => postsAPI.delete(communityId, postId).then((response) => response.data)
  )

export const useLike = (
  communityId: number,
  postId: number
): UseMutationResult<Like, Error, void> =>
  useMutation<Like, Error, void>(
    [`community_${communityId}`, `post_${postId}`, "like"],
    () => postsAPI.like(communityId, postId).then((response) => response.data)
  )

export const useFiles = (
  communityId: number,
  postId: number
): UseQueryResult<File[]> =>
  useQuery<Response<File[]>, Error, File[]>(
    [`community_${communityId}`, `post_${postId}`, "files_all"],
    () => postsAPI.getFiles(communityId, postId),
    {
      select: (response) => response.data,
      enabled: !!postId
    }
  )

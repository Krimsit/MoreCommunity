import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult
} from "@tanstack/react-query"

import communitiesAPI from "dto/api/CommunitiesAPI"

import { Response } from "types/default"
import { Community, Follow, PostCommunity, Delete } from "dto/types/Communities"
import { AxiosError } from "axios"

export const useCommunity = (): UseQueryResult<Community[]> =>
  useQuery<Response<Community[]>, Error, Community[]>(
    ["communities_all"],
    () => communitiesAPI.getAll(),
    {
      select: (response) => {
        return response.data
      }
    }
  )

export const useCreate = (): UseMutationResult<
  Community,
  { [key: string]: string },
  PostCommunity
> =>
  useMutation<Community, { [key: string]: string }, PostCommunity>(
    [`communities`, "create"],
    (data) =>
      communitiesAPI
        .create(data)
        .then((response) => response.data)
        .catch((error: AxiosError<Response<{ [key: string]: string }>>) =>
          Promise.reject(error?.response?.data.data)
        )
  )

export const useById = (communityId: number): UseQueryResult<Community> =>
  useQuery<Response<Community>, Error, Community>(
    [`community_${communityId}`],
    () => communitiesAPI.getById(communityId),
    {
      select: (response) => response.data,
      enabled: !!communityId
    }
  )

export const useUpdate = (
  communityId: number
): UseMutationResult<Community, { [key: string]: string }, PostCommunity> =>
  useMutation<Community, { [key: string]: string }, PostCommunity>(
    [`community_${communityId}`, "update"],
    (data) =>
      communitiesAPI
        .update(data, communityId)
        .then((response) => response.data)
        .catch((error: AxiosError<Response<{ [key: string]: string }>>) =>
          Promise.reject(error?.response?.data.data)
        )
  )

export const useDelete = (
  communityId: number
): UseMutationResult<Delete, Error, void> =>
  useMutation<Delete, Error, void>([`community_${communityId}`, "delete"], () =>
    communitiesAPI.delete(communityId).then((response) => response.data)
  )

export const useFollow = (
  communityId: number
): UseMutationResult<Follow, Error, void> =>
  useMutation<Follow, Error, void>([`community_${communityId}`, "follow"], () =>
    communitiesAPI.follow(communityId).then((response) => response.data)
  )

export const usePopularCommunity = (): UseQueryResult<Community[]> =>
  useQuery<Response<Community[]>, Error, Community[]>(
    ["communities_popular"],
    () => communitiesAPI.getPopular(),
    {
      select: (response) => response.data
    }
  )

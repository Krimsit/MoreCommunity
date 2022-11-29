import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult
} from "@tanstack/react-query"

import communitiesAPI from "dto/api/CommunitiesAPI"
import { Response } from "types/default"

import { Community, Follow } from "dto/types/Communities"

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

export const usePopularCommunity = (): UseQueryResult<Community[]> =>
  useQuery<Response<Community[]>, Error, Community[]>(
    ["communities_popular"],
    () => communitiesAPI.getPopular(),
    {
      select: (response) => response.data
    }
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

export const useFollow = (
  communityId: number
): UseMutationResult<Follow, Error, void> =>
  useMutation<Follow, Error, void>([`community_${communityId}`, "follow"], () =>
    communitiesAPI.follow(communityId).then((response) => response.data)
  )

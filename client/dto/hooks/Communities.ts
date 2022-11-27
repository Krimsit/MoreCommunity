import { useQuery, UseQueryResult } from "@tanstack/react-query"

import communitiesAPI from "dto/api/CommunitiesAPI"
import { Response } from "types/default"

import { Community } from "dto/types/Communities"

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

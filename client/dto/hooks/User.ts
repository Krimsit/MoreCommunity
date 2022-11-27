import { useQuery, UseQueryResult } from "@tanstack/react-query"

import userAPI from "dto/api/UserAPI"

import { User } from "dto/types/User"
import { Community } from "dto/types/Communities"
import { Response } from "types/default"

export const useUser = (): UseQueryResult<User | null> =>
  useQuery<Response<User | null>, Error, User | null>(
    ["user"],
    () => userAPI.getData(),
    {
      select: (response) => response.data
    }
  )

export const useMyCommunities = (): UseQueryResult<Community[]> =>
  useQuery<Response<Community[]>, Error, Community[]>(
    ["user_my_communities"],
    () => userAPI.getMyCommunities(),
    {
      select: (response) => response.data
    }
  )

export const useFollowedCommunities = (
  isUser: boolean
): UseQueryResult<Community[]> =>
  useQuery<Response<Community[]>, Error, Community[]>(
    ["user_followed_communities"],
    () => userAPI.getFollowedCommunities(),
    {
      select: (response) => response.data,
      enabled: isUser
    }
  )

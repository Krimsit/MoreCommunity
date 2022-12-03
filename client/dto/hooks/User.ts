import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query"

import userAPI from "dto/api/UserAPI"

import { User, Settings, Delete } from "dto/types/User"
import { Response } from "types/default"
import { Community } from "dto/types/Communities"
import { AxiosError } from "axios"

export const useUser = (): UseQueryResult<User | null> =>
  useQuery<Response<User | null>, Error, User | null>(
    ["user"],
    () => userAPI.getData(),
    {
      select: (response) => response.data
    }
  )

export const useUpdate = (
  userId: string
): UseMutationResult<User, { [key: string]: string }, Settings> =>
  useMutation<User, { [key: string]: string }, Settings>(
    [`user_${userId}`, "update"],
    (data) =>
      userAPI
        .update(data, userId)
        .then((response) => response.data)
        .catch((error: AxiosError<Response<{ [key: string]: string }>>) =>
          Promise.reject(error?.response?.data.data)
        )
  )

export const useDelete = (
  userId: string
): UseMutationResult<Delete, Error, void> =>
  useMutation<Delete, Error, void>([`user_${userId}`, "delete"], () =>
    userAPI.delete(userId).then((response) => response.data)
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

import { useQuery, UseQueryResult } from "@tanstack/react-query"

import userAPI from "dto/api/UserAPI"

import { User } from "dto/types/User"
import { Response } from "types/default"

export const useUser = (): UseQueryResult<User | null> =>
  useQuery<Response<User | null>, Error, User | null>(
    ["user"],
    () => userAPI.getData(),
    {
      select: (response) => response.data
    }
  )

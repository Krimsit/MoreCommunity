import { useQuery, UseQueryResult } from "@tanstack/react-query"

import communitiesAPI from "dto/api/CommunitiesAPI"

import { Community } from "dto/types/Communities"

export const useCommunityData = (): UseQueryResult<Community[]> =>
  useQuery<Community[], Error>(["communities"], () => communitiesAPI.getAll())

import { useQuery, UseQueryResult } from "@tanstack/react-query"

import testAPI from "../api/TestAPI"

import { TestData } from "../types/Test"

export const useTestData = (): UseQueryResult<TestData> =>
  useQuery<TestData, Error>(["test_data"], () => testAPI.getTestData())

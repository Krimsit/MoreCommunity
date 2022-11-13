import MockAdapter from "axios-mock-adapter"
import { AxiosResponse } from "axios"

import { test } from "../../core"

import { TestData } from "../types/Test"

import { TestFakeData } from "../fakeData/Test"

const fakeApi = new MockAdapter(test)

fakeApi.onGet("/").reply(200, TestFakeData)

fakeApi.restore()

const api = {
  getTestData: (): Promise<TestData> =>
    test.get("/").then((res: AxiosResponse<TestData>) => res.data)
}

export default api

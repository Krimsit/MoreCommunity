import MockAdapter from "axios-mock-adapter"
import { AxiosResponse } from "axios"

import { api } from "@core"

import { Community } from "dto/types/Communities"

import { CommunitiesFakeData } from "dto/fakeData/Communities"

const fakeApi = new MockAdapter(api)

fakeApi.onGet("/").reply(200, CommunitiesFakeData)

// fakeApi.restore()

const _api = {
  getAll: (): Promise<Community[]> =>
    api.get("/").then((res: AxiosResponse<Community[]>) => res.data)
}

export default _api

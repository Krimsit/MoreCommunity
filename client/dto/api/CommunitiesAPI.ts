import MockAdapter from "axios-mock-adapter"
import { AxiosResponse } from "axios"

import { api } from "@core"

import { Community } from "dto/types/Communities"
import { Response } from "types/default"

import { CommunitiesFakeData } from "dto/fakeData/Communities"

const fakeApi = new MockAdapter(api)

fakeApi.onGet("/").reply(200, CommunitiesFakeData)
fakeApi.onGet("/popular").reply(200, CommunitiesFakeData)

// fakeApi.restore()

const _api = {
  getAll: (): Promise<Response<Community[]>> =>
    api.get("/").then((res: AxiosResponse<Response<Community[]>>) => res.data),
  getPopular: (): Promise<Response<Community[]>> =>
    api
      .get("/popular")
      .then((res: AxiosResponse<Response<Community[]>>) => res.data)
}

export default _api

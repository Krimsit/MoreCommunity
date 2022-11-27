import MockAdapter from "axios-mock-adapter"
import { AxiosResponse } from "axios"

import { api } from "@core"

import { User } from "dto/types/User"
import { Response } from "types/default"

import { UserFakeData } from "dto/fakeData/User"

const fakeApi = new MockAdapter(api)

fakeApi.onGet("/user").reply(200, UserFakeData)

// fakeApi.restore()

const _api = {
  getData: (): Promise<Response<User | null>> =>
    api
      .get("/user")
      .then((res: AxiosResponse<Response<User | null>>) => res.data)
}

export default _api

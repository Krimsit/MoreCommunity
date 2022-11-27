import MockAdapter from "axios-mock-adapter"
import { AxiosResponse } from "axios"

import { api } from "@core"

import { User } from "dto/types/User"
import { Community } from "dto/types/Communities"
import { Response } from "types/default"

import {
  UserFakeData,
  UserMyCommunitiesFakeData,
  UserFollowedCommunitiesFakeData
} from "dto/fakeData/User"

const fakeApi = new MockAdapter(api)

fakeApi.onGet("/user").reply(200, UserFakeData)
fakeApi.onGet("/user/my-communities").reply(200, UserMyCommunitiesFakeData)
fakeApi
  .onGet("/user/followed-communities")
  .reply(200, UserFollowedCommunitiesFakeData)

// fakeApi.restore()

const _api = {
  getData: (): Promise<Response<User | null>> =>
    api
      .get("/user")
      .then((res: AxiosResponse<Response<User | null>>) => res.data),
  getMyCommunities: (): Promise<Response<Community[]>> =>
    api
      .get("/user/my-communities")
      .then((res: AxiosResponse<Response<Community[]>>) => res.data),
  getFollowedCommunities: (): Promise<Response<Community[]>> =>
    api
      .get("/user/followed-communities")
      .then((res: AxiosResponse<Response<Community[]>>) => res.data)
}

export default _api

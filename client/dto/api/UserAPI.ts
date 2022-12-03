import { AxiosResponse } from "axios"

import { api } from "@core"

import { Settings, User, Delete } from "dto/types/User"
import { Community } from "dto/types/Communities"
import { Response } from "types/default"

const _api = {
  getData: (): Promise<Response<User | null>> =>
    api
      .get("/user")
      .then((res: AxiosResponse<Response<User | null>>) => res.data),
  getSettings: (userId: string): Promise<Response<Settings>> =>
    api
      .get(`/user/${userId}/settings`)
      .then((res: AxiosResponse<Response<Settings>>) => res.data),
  update: (data: Settings, userId: string): Promise<Response<User>> =>
    api
      .put(`/user/${userId}`, data)
      .then((res: AxiosResponse<Response<User>>) => res.data),
  delete: (userId: string): Promise<Response<Delete>> =>
    api
      .delete(`/user/${userId}`)
      .then((res: AxiosResponse<Response<Delete>>) => res.data),
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

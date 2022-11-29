import { AxiosResponse } from "axios"

import { api } from "@core"

import { Community, Follow } from "dto/types/Communities"
import { Response } from "types/default"

const _api = {
  getAll: (): Promise<Response<Community[]>> =>
    api
      .get("/communities")
      .then((res: AxiosResponse<Response<Community[]>>) => res.data),
  getPopular: (): Promise<Response<Community[]>> =>
    api
      .get("/communities/popular")
      .then((res: AxiosResponse<Response<Community[]>>) => res.data),
  getById: (communityId: number): Promise<Response<Community>> =>
    api
      .get(`/communities/${communityId}`)
      .then((res: AxiosResponse<Response<Community>>) => res.data),
  follow: (communityId: number): Promise<Response<Follow>> =>
    api
      .post(`/communities/${communityId}/follow`)
      .then((res: AxiosResponse<Response<Follow>>) => res.data)
}

export default _api

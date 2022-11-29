import { AxiosResponse } from "axios"

import { api } from "@core"

import { File } from "dto/types/Files"
import { Response } from "types/default"

const _api = {
  getAll: (postId: number): Promise<Response<File[]>> =>
    api
      .get(`/files/${postId}`)
      .then((res: AxiosResponse<Response<File[]>>) => res.data)
}

export default _api

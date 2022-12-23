import { AxiosResponse } from "axios"

import { api } from "@core"

import { File, PayloadFile, PayloadPostFiles } from "dto/types/Files"
import { Response } from "types/default"

const _api = {
  upload: (data: PayloadFile): Promise<Response<File>> =>
    api
      .post("/files", data)
      .then((res: AxiosResponse<Response<File>>) => res.data),
  uploadPost: (data: PayloadPostFiles): Promise<Response<boolean>> =>
    api
      .post("/files/post", data)
      .then((res: AxiosResponse<Response<boolean>>) => res.data)
}

export default _api

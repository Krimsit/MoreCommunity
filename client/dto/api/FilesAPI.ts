import { AxiosResponse } from "axios"

import { api } from "@core"

import { File } from "dto/types/Files"
import { Response } from "types/default"

const _api = {
  upload: (file: FormData): Promise<Response<File>> =>
    api
      .post("/files", file, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res: AxiosResponse<Response<File>>) => res.data)
}

export default _api

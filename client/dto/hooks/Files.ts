import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query"

import filesAPI from "dto/api/FilesAPI"

import { UploadFileProps } from "@ui"
import { File } from "dto/types/Files"

export const useUpload = (): UseMutationResult<
  File,
  Error,
  UploadFileProps & { folder?: string; postId?: number }
> =>
  useMutation<
    File,
    Error,
    UploadFileProps & { folder?: string; postId?: number }
  >(["files", "upload"], (file) => {
    const fileData = new FormData()

    fileData.append("file", file.originalFile)
    fileData.append("type", file.type)
    fileData.append("postId", file?.postId?.toString() || "")

    if (file.folder) {
      fileData.append("folder", file.folder)
    }

    return filesAPI.upload(fileData).then((response) => response.data)
  })

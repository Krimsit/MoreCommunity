import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query"

import filesAPI from "dto/api/FilesAPI"

import { UploadFileProps } from "@ui"
import { File } from "dto/types/Files"
import { Response } from "types/default"

export const useAll = (postId: number): UseQueryResult<File[]> =>
  useQuery<Response<File[]>, Error, File[]>(
    [`post_${postId}`, "files_all"],
    () => filesAPI.getAll(postId),
    {
      select: (response) => response.data,
      enabled: !!postId
    }
  )

export const useUpload = (): UseMutationResult<
  File,
  Error,
  UploadFileProps & { folder?: string }
> =>
  useMutation<File, Error, UploadFileProps & { folder?: string }>(
    ["files", "upload"],
    (file) => {
      const fileData = new FormData()

      fileData.append("file", file.originalFile)
      fileData.append("type", file.type)

      if (file.folder) {
        fileData.append("folder", file.folder)
      }

      return filesAPI.upload(fileData).then((response) => response.data)
    }
  )

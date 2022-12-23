import { useMutation, UseMutationResult } from "@tanstack/react-query"

import filesAPI from "dto/api/FilesAPI"

import { File, PayloadFile, PayloadPostFiles } from "dto/types/Files"

export const useUpload = (): UseMutationResult<File, Error, PayloadFile> =>
  useMutation<File, Error, PayloadFile>(["files", "upload"], (data) => {
    return filesAPI.upload(data).then((response) => response.data)
  })

export const useUploadPostFiles = (): UseMutationResult<
  boolean,
  Error,
  PayloadPostFiles
> =>
  useMutation<boolean, Error, PayloadPostFiles>(
    ["files", "upload", "post"],
    (data) => {
      return filesAPI.uploadPost(data).then((response) => response.data)
    }
  )

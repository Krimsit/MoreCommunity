import { useQuery, UseQueryResult } from "@tanstack/react-query"

import filesAPI from "dto/api/FilesAPI"
import { Response } from "types/default"

import { File } from "dto/types/Files"

export const useAll = (postId: number): UseQueryResult<File[]> =>
  useQuery<Response<File[]>, Error, File[]>(
    [`post_${postId}`, "files_all"],
    () => filesAPI.getAll(postId),
    {
      select: (response) => response.data,
      enabled: !!postId
    }
  )

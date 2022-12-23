import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult
} from "@tanstack/react-query"

import streamAPI from "dto/api/StreamsAPI"

import { useById } from "dto/hooks/Communities"
import { useUser } from "dto/hooks/User"

import { Response } from "types/default"
import {
  CreateMessage,
  Message,
  PostStartStream,
  Stream
} from "dto/types/Streams"
import { AxiosError } from "axios"

export const useStream = (communityId: number): UseQueryResult<Stream> => {
  const { data, status } = useById(communityId)

  return useQuery<Response<Stream>, Error, Stream>(
    [`community_${communityId}`, "stream"],
    () => streamAPI.getData(data?.streamId || ""),
    {
      select: (response) => response.data,
      enabled: status === "success" && !!data?.streamId
    }
  )
}

export const useStart = (
  communityId: number
): UseMutationResult<
  Stream,
  { [key: string]: string },
  Omit<PostStartStream, "communityId">
> => {
  const { data: community } = useById(communityId)

  return useMutation<
    Stream,
    { [key: string]: string },
    Omit<PostStartStream, "communityId">
  >([`community_${communityId}`, "stream", "start"], (data) =>
    streamAPI
      .start({ communityId: community?.id || 0, ...data })
      .then((response) => response.data)
      .catch((error: AxiosError<Response<{ [key: string]: string }>>) =>
        Promise.reject(error?.response?.data.data)
      )
  )
}

export const useStop = (
  communityId: number
): UseMutationResult<boolean, { [key: string]: string }, null> => {
  const { data: stream, refetch } = useStream(communityId)

  refetch()

  return useMutation<boolean, { [key: string]: string }, null>(
    [`community_${communityId}`, "stream", "stop"],
    () =>
      streamAPI
        .stop({ communityId: communityId, streamId: stream?._id || "" })
        .then((response) => response.data)
        .catch((error: AxiosError<Response<{ [key: string]: string }>>) =>
          Promise.reject(error?.response?.data.data)
        )
  )
}

export const useMessages = (communityId: number): UseQueryResult<Message[]> => {
  const { data, status } = useStream(communityId)

  return useQuery<Response<Message[]>, Error, Message[]>(
    [`community_${communityId}`, "stream", "messages"],
    () => streamAPI.getAllMessages(data?._id || ""),
    {
      select: (response) => response.data,
      enabled: status === "success" && !!data?._id
    }
  )
}

export const useCreateMessage = (
  communityId: number
): UseMutationResult<Message, { [key: string]: string }, CreateMessage> => {
  const { data: streamData } = useStream(communityId)
  const { data: userData } = useUser()

  return useMutation<Message, { [key: string]: string }, CreateMessage>(
    [`community_${communityId}`, "stream", "message", "create"],
    (data) =>
      streamAPI
        .sendMessage({
          room: streamData?.key || "",
          streamId: streamData?._id || "",
          username: userData?.username || "",
          text: data.text
        })
        .then((response) => response.data)
        .catch((error: AxiosError<Response<{ [key: string]: string }>>) =>
          Promise.reject(error?.response?.data.data)
        )
  )
}

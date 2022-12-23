import { FC, useEffect } from "react"
import { useRouter } from "next/router"

import { streamSocket } from "@core"

import { useStream } from "dto/hooks/Stream"
import { useUser } from "dto/hooks/User"

import { QueryWrapper } from "@container"
import Video from "./Video"
import Chat from "./Chat"

import { Content } from "./Stream.styles"

const Stream: FC = () => {
  const router = useRouter()

  const { data: userData } = useUser()
  const { data: streamData, status: streamStatus } = useStream(
    Number(router.query.id) || 0
  )

  useEffect(() => {
    streamSocket.emit("STREAM:JOIN", {
      username: userData?.username,
      room: streamData?.key || ""
    })
  }, [streamData?.key, userData?.username])

  return (
    <QueryWrapper status={streamStatus}>
      <Content>
        <Video streamKey={streamData?.key || ""} />
        <Chat communityId={Number(router.query.id) || 0} />
      </Content>
    </QueryWrapper>
  )
}

export default Stream

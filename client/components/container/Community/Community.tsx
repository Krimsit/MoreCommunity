import { FC, useState } from "react"

import { useFollow } from "dto/hooks/Communities"

import { Avatar } from "@ui"
import { LikeButton } from "@container"

import { Community as CommunityProps } from "dto/types/Communities"

import {
  Base,
  Controls,
  Description,
  StreamButton,
  StreamStatus,
  Title
} from "./Community.styles"

const Community: FC<
  Omit<CommunityProps, "banner" | "keywords"> & { styleType?: "dark" | "light" }
> = ({
  id,
  avatar,
  name,
  followers,
  description,
  isStreamOnline,
  isMyFollow,
  isOwner,
  styleType = "light"
}) => {
  const { mutateAsync } = useFollow(id)

  const [isLike, setIsLike] = useState<boolean>(!!isMyFollow)
  const [likeCount, setLikeCount] = useState<number>(followers)

  const handleLike = () =>
    mutateAsync().then((result) => {
      setIsLike(result.isMyFollow)
      setLikeCount(result.count)
    })

  return (
    <Base styleType={styleType}>
      <Avatar img={avatar} alt={name} size="middle" styleType={styleType} />
      <Title
        href={{
          pathname: "/communities/[id]",
          query: { id: id }
        }}>
        {name}
      </Title>
      <Description>{description}</Description>
      <Controls>
        {!isOwner ? (
          <LikeButton
            count={likeCount}
            liked={isLike}
            onLike={handleLike}
            styleType={styleType}
          />
        ) : (
          `${likeCount} подписчиков`
        )}
        {isStreamOnline && (
          <StreamButton styleType={styleType}>
            <StreamStatus />
            Стрим
          </StreamButton>
        )}
      </Controls>
    </Base>
  )
}

export default Community

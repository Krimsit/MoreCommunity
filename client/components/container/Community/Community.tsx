import { FC } from "react"

import { Avatar } from "@ui"
import { LikeButton } from "@container"

import { Community as CommunityProps } from "dto/types/Communities"

import {
  Base,
  Title,
  Description,
  Controls,
  StreamButton,
  StreamStatus
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
  isMyLike,
  styleType = "light"
}) => {
  return (
    <Base styleType={styleType}>
      <Avatar img={avatar} alt={name} size="middle" styleType={styleType} />
      <Title>{name}</Title>
      <Description>{description}</Description>
      <Controls>
        <LikeButton count={followers} styleType={styleType} liked={isMyLike} />
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

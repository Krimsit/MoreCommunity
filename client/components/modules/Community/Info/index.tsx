import { FC, useState, useEffect } from "react"
import { v4 as uuid } from "uuid"
import { useMediaQuery } from "usehooks-ts"

import { useById, useFollow } from "dto/hooks/Communities"

import { Avatar, Tag } from "@ui"
import { LikeButton } from "@container"
import { MdPlayArrow } from "react-icons/md"

import {
  Container,
  Card,
  CardContent,
  StreamButton,
  StreamStatus,
  Description,
  Tags,
  ShowAllButton
} from "./Info.styles"

const Info: FC<{ communityId: number }> = ({ communityId }) => {
  const isAdaptive = useMediaQuery("(max-width: 1300px)")

  const { data } = useById(communityId)
  const { mutateAsync } = useFollow(communityId)

  const [isShowAll, setIsShowAll] = useState<boolean>(!isAdaptive)
  const [isLike, setIsLike] = useState<boolean>(!!data?.isMyLike)
  const [likeCount, setLikeCount] = useState<number>(data?.followers || 0)

  const handleToggleShowAll = () => setIsShowAll(!isShowAll)

  const handleLike = () =>
    mutateAsync().then((result) => {
      setIsLike(result.followed)
      setLikeCount(result.count)
    })

  useEffect(() => {
    setIsShowAll(!isAdaptive)
  }, [isAdaptive])

  return (
    <Container>
      <Card>
        <h1>Test</h1>
        <CardContent>
          <Avatar
            img={data?.avatar || ""}
            alt={data?.name || ""}
            styleType="dark"
            size="middle"
          />
          <div>
            <p>
              <span>{likeCount}</span>
              <br />
              подписчиков
            </p>
            <LikeButton onLike={handleLike} liked={isLike} styleType="dark" />
          </div>
        </CardContent>
      </Card>
      {isShowAll && (
        <>
          <StreamButton>
            <StreamStatus isOnline={!!data?.isStreamOnline}>
              <span></span>
              Стрим {data?.isStreamOnline ? "онлайн" : "оффлайн"}
            </StreamStatus>
            <MdPlayArrow />
          </StreamButton>
          <Description>
            <h3>Об авторе</h3>
            <span />
            <p>{data?.description}</p>
          </Description>
          <Tags>
            {data?.keywords.map((item) => (
              <Tag key={uuid()} styleType="dark">
                {item}
              </Tag>
            ))}
          </Tags>
        </>
      )}
      {isAdaptive && (
        <ShowAllButton onClick={handleToggleShowAll} styleType="dark">
          {!isShowAll ? "Показать всё" : "Скрыть"}
        </ShowAllButton>
      )}
    </Container>
  )
}

export default Info

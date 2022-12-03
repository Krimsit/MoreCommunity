import { FC, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { v4 as uuid } from "uuid"
import { useMediaQuery } from "usehooks-ts"

import { useById, useFollow } from "dto/hooks/Communities"

import { Avatar, Tag } from "@ui"
import { LikeButton } from "@container"
import CommunitySettings from "components/modules/CommunitySettings"
import { MdPlayArrow } from "react-icons/md"

import {
  Container,
  Card,
  CardContent,
  CardSettings,
  StreamButton,
  StreamStatus,
  Description,
  Tags,
  ShowAllButton
} from "./Info.styles"

const Info: FC<{ communityId: number }> = ({ communityId }) => {
  const router = useRouter()
  const isAdaptive = useMediaQuery("(max-width: 1300px)")

  const { data: communityData, refetch } = useById(communityId)
  const { mutateAsync: follow } = useFollow(communityId)

  const [isShowAll, setIsShowAll] = useState<boolean>(!isAdaptive)
  const [isLike, setIsLike] = useState<boolean>(!!communityData?.isMyLike)
  const [likeCount, setLikeCount] = useState<number>(
    communityData?.followers || 0
  )
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false)

  const settingsReducer = {
    open: () => setIsOpenSettings(true),
    close: () => setIsOpenSettings(false)
  }

  const handleToggleShowAll = () => setIsShowAll(!isShowAll)

  const handleLike = () =>
    follow().then((result) => {
      setIsLike(result.followed)
      setLikeCount(result.count)
    })

  const handleUpdateCommunity = () => {
    settingsReducer.close()
    refetch()
  }

  const handleDeleteCommunity = () => {
    settingsReducer.close()
    router.push("/")
  }

  useEffect(() => {
    setIsShowAll(!isAdaptive)
  }, [isAdaptive])

  return (
    <>
      <Container>
        <Card>
          <h1>{communityData?.name}</h1>
          <CardContent>
            <Avatar
              img={communityData?.avatar || ""}
              alt={communityData?.name || ""}
              styleType="dark"
              size="middle"
            />
            <div>
              <p>
                <span>{likeCount}</span>
                <br />
                подписчиков
              </p>
              {!communityData?.isOwner && (
                <LikeButton
                  onLike={handleLike}
                  liked={isLike}
                  styleType="dark"
                />
              )}
            </div>
          </CardContent>
          <CardSettings onClick={settingsReducer.open} />
        </Card>
        {isShowAll && (
          <>
            <StreamButton>
              <StreamStatus isOnline={!!communityData?.isStreamOnline}>
                <span></span>
                Стрим {communityData?.isStreamOnline ? "онлайн" : "оффлайн"}
              </StreamStatus>
              <MdPlayArrow />
            </StreamButton>
            <Description>
              <h3>Об авторе</h3>
              <span />
              <p>{communityData?.description}</p>
            </Description>
            <Tags>
              {communityData?.keywords.map((item) => (
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
      <CommunitySettings
        open={isOpenSettings}
        onClose={settingsReducer.close}
        communityId={communityId}
        onSuccess={handleUpdateCommunity}
        onDelete={handleDeleteCommunity}
      />
    </>
  )
}

export default Info

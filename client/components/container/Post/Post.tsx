import { FC, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import ruLocale from "date-fns/locale/ru"
import { useMediaQuery } from "usehooks-ts"

import { useAll } from "dto/hooks/Files"
import { useLast } from "dto/hooks/Comments"
import { useUser } from "dto/hooks/User"
import { useLike } from "dto/hooks/Posts"

import { File } from "@ui"
import { LikeButton, CommentsButton, QueryWrapper } from "@container"
import Detail from "./Detail"

import { Post } from "dto/types/Posts"

import {
  Base,
  Header,
  Status,
  Time,
  Title,
  Content,
  Files,
  MoreFiles,
  Controls,
  ControlsMin,
  OpenAllButton,
  CommentsBlock,
  Comments,
  CreateCommentAvatar,
  Comment,
  CommentData,
  ShowAllComments
} from "./Post.styles"

const Post: FC<Post & { styleType?: "light" | "dark" }> = ({
  id,
  title,
  likes,
  content,
  comments,
  createdAt,
  isMyLike,
  communityId,
  styleType = "light"
}) => {
  const { data: filesData, status: filesStatus } = useAll(id)
  const { data: commentsData, status: commentsStatus } = useLast(
    communityId,
    id
  )
  const { mutateAsync } = useLike(communityId, id)

  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
  const [isOpenAllFiles, setIsOpenAllFiles] = useState<boolean>(false)
  const [isLike, setIsLike] = useState<boolean>(!!isMyLike)
  const [likeCount, setLikeCount] = useState<number>(likes)

  const detailReducer = {
    open: () => setIsOpenDetail(true),
    close: () => setIsOpenDetail(false)
  }

  const handleToggleOpenAllFiles = () => setIsOpenAllFiles(!isOpenAllFiles)

  const handleLike = () =>
    mutateAsync().then((result) => {
      setIsLike(result.followed)
      setLikeCount(result.count)
    })

  return (
    <>
      <Base styleType={styleType}>
        <Header>
          <Status>
            <div></div>
            <Time>
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: ruLocale
              })}
            </Time>
          </Status>
          <Title>{title}</Title>
        </Header>
        <Content
          dangerouslySetInnerHTML={{
            __html: content
          }}
        />
        <QueryWrapper status={filesStatus}>
          {!!filesData?.length && (
            <Files>
              {filesData
                .slice(0, !isOpenAllFiles ? 5 : filesData.length)
                .map((item) => (
                  <File key={item.id} styleType={styleType} {...item} />
                ))}
              {filesData.length > 5 && (
                <MoreFiles
                  onClick={handleToggleOpenAllFiles}
                  styleType={styleType}>
                  +{filesData.length - 5}
                </MoreFiles>
              )}
            </Files>
          )}
        </QueryWrapper>
        <Controls>
          <OpenAllButton onClick={detailReducer.open} styleType={styleType}>
            Открыть полностью
          </OpenAllButton>
          <ControlsMin>
            <LikeButton
              count={likeCount}
              liked={isLike}
              onLike={handleLike}
              styleType={styleType}
            />
            <CommentsButton
              count={comments}
              styleType={styleType}
              onClick={detailReducer.open}
            />
          </ControlsMin>
        </Controls>
        <CommentsBlock>
          <QueryWrapper status={commentsStatus}>
            <Comments>
              {commentsData?.map((item) => (
                <Comment key={item.id} styleType={styleType}>
                  <CreateCommentAvatar
                    img={item.avatar || ""}
                    alt={item.username || ""}
                    styleType={styleType}
                  />
                  <CommentData>
                    <span>{item.username}</span>
                    <p>{item.content}</p>
                    <span className="date">
                      {formatDistanceToNow(new Date(item.createdAd), {
                        addSuffix: true,
                        locale: ruLocale
                      })}
                    </span>
                  </CommentData>
                </Comment>
              ))}
            </Comments>
            {!!commentsData?.length && (
              <ShowAllComments
                onClick={detailReducer.open}
                styleType={styleType}>
                Посмотреть все комментарии
              </ShowAllComments>
            )}
          </QueryWrapper>
        </CommentsBlock>
      </Base>
      <Detail
        communityId={communityId}
        postId={id}
        open={isOpenDetail}
        onClose={detailReducer.close}
        styleType={styleType}
      />
    </>
  )
}

export default Post

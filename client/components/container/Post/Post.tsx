import { FC, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import ruLocale from "date-fns/locale/ru"

import { useFiles, useLike } from "dto/hooks/Posts"

import PostContext from "./PostContext"

import { File } from "@ui"
import { CommentsButton, LikeButton, QueryWrapper } from "@container"
import Detail from "./Detail"

import { PostProps } from "./Post.interface"

import {
  Base,
  Content,
  Controls,
  Files,
  Header,
  MoreFiles,
  OpenAllButton,
  Status,
  Time,
  Title,
  UserControls
} from "./Post.styles"

const Post: FC<PostProps> = ({
  post,
  styleType = "light",
  isOwner,
  communityName
}) => {
  const { data: filesData, status: filesStatus } = useFiles(
    post.communityId,
    post.id
  )
  const { mutateAsync: like, status: likeStatus } = useLike(
    post.communityId,
    post.id
  )

  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
  const [isOpenAllFiles, setIsOpenAllFiles] = useState<boolean>(false)
  const [isLike, setIsLike] = useState<boolean>(!!post.isMyLike)
  const [likeCount, setLikeCount] = useState<number>(post.likes)

  const detailReducer = {
    open: () => setIsOpenDetail(true),
    close: () => setIsOpenDetail(false)
  }

  const handleToggleOpenAllFiles = () => setIsOpenAllFiles(!isOpenAllFiles)

  const handleLike = () =>
    like().then((result) => {
      setIsLike(result.isMyLike)
      setLikeCount(result.count)
    })

  return (
    <PostContext.Provider
      value={{
        communityId: post.communityId,
        communityName: communityName,
        postId: post.id,
        isOwner: isOwner
      }}>
      <Base styleType={styleType}>
        <Header>
          <Status>
            <div></div>
            <Time>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ruLocale
              })}
            </Time>
          </Status>
          <Title>{post.title}</Title>
        </Header>
        <Content
          dangerouslySetInnerHTML={{
            __html: post.content
          }}
        />
        <QueryWrapper status={filesStatus} loaderSize="2em">
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
          <UserControls>
            <LikeButton
              count={likeCount}
              liked={isLike}
              onLike={handleLike}
              styleType={styleType}
              loading={likeStatus === "loading"}
            />
            <CommentsButton
              count={post.comments}
              styleType={styleType}
              onClick={detailReducer.open}
            />
          </UserControls>
        </Controls>
      </Base>
      {post && <Detail open={isOpenDetail} onClose={detailReducer.close} />}
    </PostContext.Provider>
  )
}

export default Post

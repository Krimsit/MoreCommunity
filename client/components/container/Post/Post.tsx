import { FC, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import ruLocale from "date-fns/locale/ru"

import { useAll } from "dto/hooks/Files"
import { useLast } from "dto/hooks/Comments"
import { useLike } from "dto/hooks/Posts"

import PostContext from "./PostContext"

import { File } from "@ui"
import { LikeButton, CommentsButton, QueryWrapper } from "@container"
import Detail from "./Detail"

import { PostProps } from "./Post.interface"

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
  UserControls,
  OpenAllButton,
  CommentsBlock,
  Comments,
  CreateCommentAvatar,
  Comment,
  CommentData,
  ShowAllComments
} from "./Post.styles"

const Post: FC<PostProps> = ({
  post,
  styleType = "light",
  isOwner,
  communityName
}) => {
  const { data: filesData, status: filesStatus } = useAll(post.id)
  const { data: commentsData, status: commentsStatus } = useLast(
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
      setIsLike(result.followed)
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
        <CommentsBlock>
          <QueryWrapper status={commentsStatus} loaderSize="2em">
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
      {post && <Detail open={isOpenDetail} onClose={detailReducer.close} />}
    </PostContext.Provider>
  )
}

export default Post

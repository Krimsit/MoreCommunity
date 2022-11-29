import { FC, useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import ruLocale from "date-fns/locale/ru"
import { useMediaQuery } from "usehooks-ts"

import { useById } from "dto/hooks/Posts"
import { useAll as useAllFiles } from "dto/hooks/Files"
import { useAll as useAllComments, useCreate } from "dto/hooks/Comments"
import { useUser } from "dto/hooks/User"
import { useLike } from "dto/hooks/Posts"

import { File, Avatar, Modal } from "@ui"
import { LikeButton, CommentsButton, QueryWrapper } from "@container"
import { MdSend } from "react-icons/md"

import { Comment as IComment, PostComment } from "dto/types/Comments"

import {
  Base,
  Header,
  Status,
  Time,
  Title,
  Content,
  Files,
  Controls,
  ControlsMin,
  CommentsBlock,
  Comments,
  CreateComment,
  CreateCommentAvatar,
  CreateCommentInput,
  CreateCommentButton,
  Comment,
  CommentData
} from "./Post.styles"

const Post: FC<{
  styleType?: "light" | "dark"
  communityId: number
  postId: number
  open: boolean
  onClose: () => void
}> = ({ postId, communityId, styleType = "light", open, onClose }) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  const { data: postData, status: postStatus } = useById(communityId, postId)
  const { data: userData } = useUser()
  const { data: filesData, status: filesStatus } = useAllFiles(
    postData?.id ? postData.id : 0
  )
  const { data: commentsData, status: commentsStatus } = useAllComments(
    communityId,
    postData?.id ? postData.id : 0
  )
  const { mutateAsync: like } = useLike(
    communityId,
    postData?.id ? postData.id : 0
  )
  const { mutateAsync: createComment } = useCreate(
    communityId,
    postData?.id ? postData.id : 0
  )

  const [isLike, setIsLike] = useState<boolean>(!!postData?.isMyLike)
  const [likeCount, setLikeCount] = useState<number>(postData?.likes || 0)
  const [comments, setComments] = useState<IComment[]>(commentsData || [])

  const handleLike = () =>
    like().then((result) => {
      setIsLike(result.followed)
      setLikeCount(result.count)
    })

  const handleCreateComment = (values: PostComment) =>
    createComment(values).then((comment) => setComments([...comments, comment]))

  useEffect(() => {
    setComments(commentsData || [])
  }, [commentsData])

  return (
    <Modal open={open} onClose={onClose}>
      <Base styleType={styleType}>
        <QueryWrapper status={postStatus}>
          <Header>
            <Status>
              <div></div>
              <Time>
                {!!postData?.createdAt &&
                  formatDistanceToNow(new Date(postData?.createdAt), {
                    addSuffix: true,
                    locale: ruLocale
                  })}
              </Time>
            </Status>
            <Title>{postData?.title}</Title>
          </Header>
          <Content
            isDetail
            dangerouslySetInnerHTML={{
              __html: postData?.content || ""
            }}
          />
          <QueryWrapper status={filesStatus}>
            {!!filesData?.length && (
              <Files>
                {filesData.map((item) => (
                  <File key={item.id} styleType={styleType} {...item} />
                ))}
              </Files>
            )}
          </QueryWrapper>
          <Controls>
            <ControlsMin>
              <LikeButton
                count={likeCount}
                liked={isLike}
                onLike={handleLike}
                styleType={styleType}
              />
              <CommentsButton
                count={postData?.comments}
                styleType={styleType}
              />
            </ControlsMin>
          </Controls>
          <CommentsBlock>
            <QueryWrapper status={commentsStatus}>
              <Comments>
                {comments?.map((item) => (
                  <Comment key={item.id} styleType={styleType}>
                    <Avatar
                      img={item.avatar || ""}
                      alt={item.username || ""}
                      size="small"
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
              <CreateComment onSubmit={handleCreateComment}>
                <CreateCommentAvatar
                  img={userData?.avatar || ""}
                  alt={userData?.username || ""}
                  size="small"
                  styleType={styleType}
                />
                <CreateComment.FormField name="content">
                  <CreateCommentInput
                    placeholder="Ваш комментарий"
                    styleType={styleType}
                  />
                </CreateComment.FormField>
                <CreateCommentButton styleType={styleType}>
                  {isMobile && "Отправить"}
                  <MdSend />
                </CreateCommentButton>
              </CreateComment>
            </QueryWrapper>
          </CommentsBlock>
        </QueryWrapper>
      </Base>
    </Modal>
  )
}

export default Post

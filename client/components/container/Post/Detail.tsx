import { FC, useState, useEffect, useContext } from "react"
import { formatDistanceToNow } from "date-fns"
import ruLocale from "date-fns/locale/ru"
import { useMediaQuery } from "usehooks-ts"

import { useById } from "dto/hooks/Posts"
import { useAll as useAllFiles } from "dto/hooks/Files"
import { useAll as useAllComments, useCreate } from "dto/hooks/Comments"
import { useUser } from "dto/hooks/User"
import { useLike, useDelete } from "dto/hooks/Posts"

import PostContext from "./PostContext"

import { File, Avatar, Modal } from "@ui"
import { LikeButton, CommentsButton, QueryWrapper } from "@container"
import PostSettings from "components/modules/PostSettings"
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
  OwnerControls,
  OwnerControlsEdit,
  OwnerControlsDelete,
  UserControls,
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
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const { postId, communityId, communityName, isOwner } =
    useContext(PostContext)

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
  const { mutateAsync: deletePost } = useDelete(
    communityId,
    postData?.id as number
  )

  const [isLike, setIsLike] = useState<boolean>(!!postData?.isMyLike)
  const [likeCount, setLikeCount] = useState<number>(postData?.likes || 0)
  const [comments, setComments] = useState<IComment[]>(commentsData || [])
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false)

  const settingReducer = {
    open: () => {
      onClose()
      setIsOpenSettings(true)
    },
    close: () => setIsOpenSettings(false)
  }

  const handleLike = () =>
    like().then((result) => {
      setIsLike(result.followed)
      setLikeCount(result.count)
    })

  const handleDelete = () => deletePost().then(() => onClose())

  const handleCreateComment = (values: PostComment) =>
    createComment(values).then((comment) => setComments([...comments, comment]))

  useEffect(() => {
    setComments(commentsData || [])
  }, [commentsData])

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Base styleType="dark">
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
                    <File key={item.id} styleType="dark" {...item} />
                  ))}
                </Files>
              )}
            </QueryWrapper>
            <Controls>
              {isOwner && (
                <OwnerControls>
                  <OwnerControlsEdit onClick={settingReducer.open} />
                  <OwnerControlsDelete onClick={handleDelete} />
                </OwnerControls>
              )}
              <UserControls>
                <LikeButton
                  count={likeCount}
                  liked={isLike}
                  onLike={handleLike}
                  styleType="dark"
                />
                <CommentsButton count={postData?.comments} styleType="dark" />
              </UserControls>
            </Controls>
            <CommentsBlock>
              <QueryWrapper status={commentsStatus}>
                <Comments>
                  {comments?.map((item) => (
                    <Comment key={item.id} styleType="dark">
                      <Avatar
                        img={item.avatar || ""}
                        alt={item.username || ""}
                        size="small"
                        styleType="dark"
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
                    styleType="dark"
                  />
                  <CreateComment.FormField name="content">
                    <CreateCommentInput
                      placeholder="Ваш комментарий"
                      styleType="dark"
                    />
                  </CreateComment.FormField>
                  <CreateCommentButton styleType="dark">
                    {isMobile && "Отправить"}
                    <MdSend />
                  </CreateCommentButton>
                </CreateComment>
              </QueryWrapper>
            </CommentsBlock>
          </QueryWrapper>
        </Base>
      </Modal>
      {postStatus === "success" && filesStatus === "success" && (
        <PostSettings
          open={isOpenSettings}
          onClose={settingReducer.close}
          communityId={communityId}
          communityName={communityName}
          initialValues={{
            id: postData?.id || 0,
            title: postData?.title || "",
            content: postData?.content || "",
            files: filesData || []
          }}
        />
      )}
    </>
  )
}

export default Post

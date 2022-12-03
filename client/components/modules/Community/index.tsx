import { FC, useState } from "react"
import { useRouter } from "next/router"

import { useAll } from "dto/hooks/Posts"
import { useById } from "dto/hooks/Communities"

import Info from "./Info"
import { Post, QueryWrapper } from "@container"
import { Button } from "@ui"
import PostSettings from "components/modules/PostSettings"

import { Container, Banner, Content, Posts } from "./Community.styles"

const Community: FC = () => {
  const route = useRouter()

  const { data: communityData, status: communityStatus } = useById(
    Number(route.query.id)
  )
  const { data: postsData, status: postsStatus } = useAll(
    communityData?.id ? communityData.id : 0,
    !!route.query.id
  )

  const [isOpenCreatePost, setIsOpenCreatePost] = useState<boolean>(false)

  const createPostReducer = {
    open: () => setIsOpenCreatePost(true),
    close: () => setIsOpenCreatePost(false)
  }

  return (
    <>
      <Container>
        <Banner
          src={communityData?.banner || ""}
          alt={communityData?.name || ""}
        />
        <Content>
          <Info communityId={communityData?.id || 0} />
          <Posts>
            <Button onClick={createPostReducer.open} styleType="dark">
              Создать пост
            </Button>
            <QueryWrapper status={postsStatus}>
              {postsData?.map((item) => (
                <Post
                  key={item.id}
                  styleType="dark"
                  isOwner={!!communityData?.isOwner}
                  communityName={communityData?.name || ""}
                  post={item}
                />
              ))}
            </QueryWrapper>
          </Posts>
        </Content>
      </Container>
      {communityStatus === "success" && (
        <PostSettings
          open={isOpenCreatePost}
          onClose={createPostReducer.close}
          communityId={communityData?.id || 0}
          communityName={communityData?.name || ""}
        />
      )}
    </>
  )
}

export default Community

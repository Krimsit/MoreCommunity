import { FC } from "react"
import { useRouter } from "next/router"

import { useAll } from "dto/hooks/Posts"
import { useById } from "dto/hooks/Communities"

import Info from "./Info"
import { Post, QueryWrapper } from "@container"

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

  return (
    <Container>
      <QueryWrapper status={communityStatus}>
        <Banner
          src={communityData?.banner || ""}
          alt={communityData?.name || ""}
        />
        <Content>
          <Info communityId={communityData?.id || 0} />
          <QueryWrapper status={postsStatus}>
            <Posts>
              {postsData?.map((item) => (
                <Post key={item.id} styleType="dark" {...item} />
              ))}
            </Posts>
          </QueryWrapper>
        </Content>
      </QueryWrapper>
    </Container>
  )
}

export default Community

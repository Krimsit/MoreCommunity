import { FC } from "react"
import { useRouter } from "next/router"

import { useUser, useFollowedCommunities } from "dto/hooks/User"
import { usePopularCommunity } from "dto/hooks/Communities"

import UserCard from "./UserCard"
import { QueryWrapper, Community } from "@container"
import { MdMore } from "react-icons/md"

import {
  Container,
  Block,
  Title,
  Communities,
  ShowMoreCommunities
} from "./Main.styles"

const Main: FC = () => {
  const router = useRouter()

  const { data: user, status: userStatus } = useUser()
  const { data: followedCommunities, status: followedCommunitiesStatus } =
    useFollowedCommunities(!!user)
  const { data: popularCommunities, status: popularCommunitiesStatus } =
    usePopularCommunity()

  const handleRedirectToCommunitiesPage = () => router.push("/communities")

  return (
    <Container>
      <QueryWrapper status={userStatus}>
        {!!user && (
          <>
            <UserCard />
            <QueryWrapper status={followedCommunitiesStatus}>
              <Block>
                <Title>Сообщества, на которые вы подписанны</Title>
                <Communities>
                  {followedCommunities?.length
                    ? followedCommunities.map((item) => (
                        <Community key={item.id} {...item} />
                      ))
                    : "Вы не подписанны ни на одно сообщество"}
                </Communities>
              </Block>
            </QueryWrapper>
          </>
        )}
      </QueryWrapper>
      <QueryWrapper status={popularCommunitiesStatus}>
        <Block>
          <Title>Популярные сообщества</Title>
          <Communities>
            {popularCommunities?.length
              ? popularCommunities?.map((item) => (
                  <Community key={item.id} {...item} />
                ))
              : "Пока не созданно ни одного сообщества"}
          </Communities>
          <ShowMoreCommunities onClick={handleRedirectToCommunitiesPage}>
            Все сообщества
            <MdMore />
          </ShowMoreCommunities>
        </Block>
      </QueryWrapper>
    </Container>
  )
}

export default Main

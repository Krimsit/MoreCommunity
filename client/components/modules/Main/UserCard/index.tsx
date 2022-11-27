import { FC } from "react"

import { useUser, useMyCommunities } from "dto/hooks/User"

import { QueryWrapper } from "@container"
import { Avatar } from "@ui"
import { MdAddCircle } from "react-icons/md"

import {
  Base,
  Content,
  Username,
  Communities,
  NoCommunities,
  SettingsButton,
  CreateCommunity,
  Community,
  CommunitiesTitle
} from "./UserCard.styles"

const UserCard: FC = () => {
  const { data: user } = useUser()
  const { data: communities, status: communitiesStatus } = useMyCommunities()

  const handleCreateCommunity = () => console.log("Open create community popup")

  const handleOpenUserSettings = () => console.log("Open user settings popup")

  return (
    <Base>
      <div>
        <Avatar
          img={user?.avatar || ""}
          alt={user?.username || ""}
          styleType="dark"
          size="middle"
        />
        <Username>{user?.username}</Username>
      </div>
      <Content>
        <QueryWrapper status={communitiesStatus}>
          <>
            <CommunitiesTitle>Ваши сообщества:</CommunitiesTitle>
            {!!communities?.length && (
              <Communities>
                {communities.map((item) => (
                  <Community key={item.id}>
                    <Avatar
                      img={item.avatar || ""}
                      alt={item.name || ""}
                      styleType="dark"
                      size="small"
                    />
                    <div>
                      <p>{item.name}</p>
                      <span>Подписчиков: {item.followers}</span>
                    </div>
                  </Community>
                ))}
              </Communities>
            )}
            {!communities?.length ? (
              <NoCommunities onClick={handleCreateCommunity} styleType="dark">
                Вы пока не создали свои сообщества. Создать <MdAddCircle />
              </NoCommunities>
            ) : (
              <CreateCommunity onClick={handleCreateCommunity}>
                Создать ещё
              </CreateCommunity>
            )}
          </>
        </QueryWrapper>
      </Content>
      <SettingsButton onClick={handleOpenUserSettings} />
    </Base>
  )
}

export default UserCard

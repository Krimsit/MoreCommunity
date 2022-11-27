import { FC } from "react"

import { Button, Avatar } from "@ui"
import { MdMenu } from "react-icons/md"

import { Container, Content } from "./Header.styles"

const Header: FC = () => {
  return (
    <Container>
      <Content>
        <Button styleType="dark">
          <MdMenu />
          Меню
        </Button>
        <Avatar img="" alt="" size="small" styleType="dark" />
      </Content>
    </Container>
  )
}

export default Header

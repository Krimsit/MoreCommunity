import { FC, useState } from "react"

import { useUser } from "dto/hooks/User"

import { Button, Avatar, Modal } from "@ui"
import Authentication from "components/modules/Authentication"
import { MdMenu } from "react-icons/md"

import { Container, Content, LoginButton } from "./Header.styles"

const Header: FC = () => {
  const { data } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const modalReducer = {
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }

  return (
    <>
      <Container>
        <Content>
          <Button styleType="dark">
            <MdMenu />
            Меню
          </Button>
          {!data ? (
            <LoginButton onClick={modalReducer.open}>
              Войти / Зарегестрироваться
            </LoginButton>
          ) : (
            <Avatar
              img={data?.avatar || ""}
              alt={data?.username}
              size="small"
              styleType="dark"
            />
          )}
        </Content>
      </Container>
      <Modal open={isOpen} onClose={modalReducer.close}>
        <Authentication />
      </Modal>
    </>
  )
}

export default Header

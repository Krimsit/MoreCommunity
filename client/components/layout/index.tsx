import { FC } from "react"
import Head from "next/head"

import { Header } from "./common"

import { LayoutProps } from "./Layout.interface"

import { Container, Main } from "./Layout.styles"

const Layout: FC<LayoutProps> = ({ children, title = "More Community" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Container>
        <Header />
        <Main>{children}</Main>
      </Container>
    </>
  )
}

export default Layout

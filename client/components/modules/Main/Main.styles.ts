import styled from "styled-components"

import { Button } from "@ui"

export const Container = styled.section.attrs(() => ({
  className: "container2"
}))`
  padding: 30px 20px 50px !important;
`

export const Block = styled.div`
  margin-top: 80px;
`

export const Communities = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 350px));
  justify-content: space-evenly;
  gap: 35px;
`

export const Title = styled.h1`
  margin: 0 0 50px;
  padding: 0;
  font-weight: 700;
  font-size: 36px;
  line-height: 44px;
`

export const ShowMoreCommunities = styled(Button).attrs(() => ({
  styleType: "light"
}))`
  margin: 40px auto 0;
`

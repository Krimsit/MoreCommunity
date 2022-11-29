import styled from "styled-components"
import BaseImage from "next/image"

export const Container = styled.section`
  position: relative;
`

export const Banner = styled(BaseImage).attrs(() => ({
  width: 100,
  height: 100,
  sizes: "100vw"
}))`
  max-height: 200px;
  width: 100%;
  height: 100%;
  object-position: center;
  object-fit: cover;
`

export const Content = styled.div.attrs(() => ({
  className: "container"
}))`
  margin: 20px auto 50px;
  display: grid;
  grid-template-columns: 400px 700px;
  gap: 100px;
  justify-content: space-between;

  @media screen and (max-width: 1300px) {
    grid-template-columns: 100%;
    gap: 10px;
    margin-bottom: 0;
  }
`

export const Posts = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;

  @media screen and (max-width: 1300px) {
    transform: translateY(-100px);
    align-items: center;
  }
`

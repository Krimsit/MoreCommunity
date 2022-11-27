import styled from "styled-components"

export const Container = styled.header`
  background: ${({ theme }) => theme.dark};
  padding: 20px 0;
  box-sizing: border-box;
`

export const Content = styled.div.attrs(() => ({
  className: "container"
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  height: 100%;
`

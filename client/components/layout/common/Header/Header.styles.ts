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

export const LoginButton = styled.span`
  cursor: pointer;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 14px;
  font-weight: bold;
  text-decoration: underline;
`

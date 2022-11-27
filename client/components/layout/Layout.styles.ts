import styled from "styled-components"

export const Container = styled.section`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.light};
  color: ${({ theme }) => theme.text.light};
`

export const Main = styled.main`
  width: 100%;
`

import styled from "styled-components"

import { Container } from "@ui"

export const Base = styled(Container).attrs(() => ({
  type: "2"
}))`
  max-width: 100%;
  width: 250px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0 15px;
  padding: 0 20px;
  height: 60px;
  min-height: 0;
`

export const Field = styled.input`
  flex: 1;
  height: 100%;
  background: transparent;
  border: 0;
  color: ${({ theme }) => theme.text.light};
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

  &::placeholder {
    font-weight: 300;
  }
`

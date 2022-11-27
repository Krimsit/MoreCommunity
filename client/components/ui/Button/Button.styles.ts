import styled from "styled-components"
import tinycolor from "tinycolor2"

import { StylesBase } from "./Button.interface"

export const Base = styled.button<StylesBase>`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px 50px;
  gap: 15px;
  border: 0;
  border-radius: 27px;
  background: ${({ theme, styleType }) => theme[styleType]};
  box-shadow: -12px -12px 24px ${({ theme, styleType }) => theme.shadows[styleType].main},
    12px 12px 24px ${({ theme, styleType }) => theme.shadows[styleType].outline};
  color: ${({ theme }) => theme.text.light};
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme, styleType }) =>
      tinycolor(theme[styleType]).darken(2).toHexString()};
  }
`

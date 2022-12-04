import styled, {
  css,
  FlattenSimpleInterpolation,
  DefaultTheme
} from "styled-components"

import {
  ContainerStyleType,
  ContainerType,
  StylesBase
} from "./Container.interface"

const getStylesByTypeAndColor = (
  type: ContainerType,
  styleType: ContainerStyleType,
  theme: DefaultTheme
): FlattenSimpleInterpolation => {
  const _color = styleType === "light" ? theme.light : theme.dark
  const _shadows =
    styleType === "light" ? theme.shadows.light : theme.shadows.dark

  switch (type) {
    case "1":
      return css`
        background: ${_color};
        box-shadow: -12px -12px 24px ${_shadows.main},
          12px 12px 24px ${_shadows.outline};
      `
    case "2":
      return css`
        background: ${_color};
        box-shadow: -10px -10px 20px ${_shadows.main},
          10px 10px 20px ${_shadows.outline},
          inset -4px -4px 8px ${_shadows.light},
          inset 4px 4px 8px ${_shadows.outline};
      `
    case "3":
      return css`
        background: ${_color};
        box-shadow: inset -12px -12px 24px ${_shadows.main},
          inset 12px 12px 24px ${_shadows.outline};
      `
    case "4":
      return css`
        background: ${_color};
        box-shadow: inset 12px 12px 24px ${_shadows.main},
          inset -12px -12px 24px ${_shadows.outline};
      `
    default:
      return css``
  }
}

export const Base = styled.div<StylesBase>`
  border-radius: 13px;
  padding: 10px;
  max-width: 100%;
  width: max-content;
  min-width: 100px;
  min-height: 100px;
  box-sizing: border-box;

  ${({ theme, type, styleType }) =>
    getStylesByTypeAndColor(
      type as ContainerType,
      styleType as ContainerStyleType,
      theme
    )}
`

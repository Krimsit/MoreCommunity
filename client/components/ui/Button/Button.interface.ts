import { MouseEventHandler, ReactNode } from "react"

import { DefaultStyles } from "types/default"

type ButtonType = "button" | "submit" | "reset"

export type ButtonStyleType = "light" | "dark"

export interface ButtonProps {
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  styleType?: ButtonStyleType
  disabled?: boolean
  type?: ButtonType
  className?: string
}

export interface StylesBase extends DefaultStyles {
  styleType: ButtonStyleType
}

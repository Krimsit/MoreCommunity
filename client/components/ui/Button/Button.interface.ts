import { MouseEventHandler, ReactNode } from "react"

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

export interface StylesBase {
  styleType: ButtonStyleType
}

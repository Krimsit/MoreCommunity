import { HTMLInputTypeAttribute, ReactNode } from "react"

export type InputStyleType = "light" | "dark"

export interface InputProps {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  name?: string
  disable?: boolean
  type?: HTMLInputTypeAttribute
  prefix?: ReactNode
  className?: string
  styleType?: InputStyleType
}

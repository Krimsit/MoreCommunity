import { FC } from "react"

import { ButtonProps } from "./Button.interface"

import { Base } from "./Button.styles"

const Button: FC<ButtonProps> = ({
  children,
  type = "button",
  styleType = "light",
  onClick,
  disabled = false,
  className
}) => {
  return (
    <Base
      onClick={onClick}
      styleType={styleType}
      type={type}
      disabled={disabled}
      className={className}>
      {children}
    </Base>
  )
}

export default Button

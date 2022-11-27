import { FC } from "react"
import classes from "classnames"

import { ContainerProps } from "./Container.interface"

import { Base } from "./Container.styles"

const Container: FC<ContainerProps> = ({
  children,
  type = "1",
  styleType = "light",
  className
}) => {
  return (
    <Base
      type={type}
      styleType={styleType}
      className={classes(className, {
        [`${className}-${styleType}`]: !!className
      })}>
      {children}
    </Base>
  )
}

export default Container

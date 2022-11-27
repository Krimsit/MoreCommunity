import { FC, ReactNode } from "react"
import BaseLink, { LinkProps } from "next/link"

const Link: FC<LinkProps & { children?: ReactNode }> = (props) => {
  return <BaseLink {...props}>{props.children}</BaseLink>
}

export default Link

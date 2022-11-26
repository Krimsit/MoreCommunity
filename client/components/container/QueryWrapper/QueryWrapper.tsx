import { FC } from "react"

import { QueryWrapperProps } from "./QueryWrapper.interface"

import { LoaderContainer, PulseLoader } from "./QueryWrapper.styles"

const QueryWrapper: FC<QueryWrapperProps> = ({
  status,
  loader = <PulseLoader />,
  children
}) => {
  if (status === "loading") {
    return <LoaderContainer>{loader}</LoaderContainer>
  }

  return <>{children}</>
}

export default QueryWrapper

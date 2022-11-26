import { ReactNode } from "react"
import { QueryStatus } from "@tanstack/react-query"

export interface QueryWrapperProps {
  status: QueryStatus
  children: ReactNode
  loader?: ReactNode
}

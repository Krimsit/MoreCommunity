import { Settings } from "dto/types/User"
import { File } from "dto/types/Files"

export interface UserSettingsProps {
  open: boolean
  onClose: () => void
  userId: string
}

export type InitialValues = Omit<Settings, "avatar"> & {
  avatar: File[]
}

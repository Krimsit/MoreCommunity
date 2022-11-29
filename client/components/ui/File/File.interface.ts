export type FileType = "image" | "video" | "audio" | "document"
export type FileStyleType = "light" | "dark"

export interface FileProps {
  type: FileType
  url: string
  alt?: string
  name?: string
  styleType?: FileStyleType
}

export type FileType = "image" | "video" | "audio" | "document"

export type File = {
  id: number
  type: FileType
  url: string
  name: string
}

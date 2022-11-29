import { FC } from "react"

import {
  MdImage,
  MdInsertDriveFile,
  MdAudiotrack,
  MdVideocam
} from "react-icons/md"

import { FileProps } from "./File.interface"

import { Base, Image, Video, Overlay, Filename } from "./File.styles"

const File: FC<FileProps> = ({ type, url, alt, name, styleType = "light" }) => {
  const renderData = () => {
    switch (type) {
      case "image":
        return (
          <>
            <Image src={url || ""} alt={alt || ""} />
            <Overlay>
              <MdImage />
            </Overlay>
          </>
        )
      case "video":
        return (
          <>
            <Video preload="metadata">
              <source src={url || ""} />
            </Video>
            <Overlay>
              <MdVideocam />
            </Overlay>
          </>
        )
      case "audio":
        return <MdAudiotrack />
      case "document":
        return <MdInsertDriveFile />
      default:
        return <></>
    }
  }

  return (
    <Base styleType={styleType}>
      {renderData()}
      {!!name && <Filename>{name}</Filename>}
    </Base>
  )
}

export default File

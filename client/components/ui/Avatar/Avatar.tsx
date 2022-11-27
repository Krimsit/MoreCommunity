import { FC } from "react"

import { MdPerson } from "react-icons/md"

import { AvatarProps } from "./Avatar.interface"

import { Base, ImageContainer, Image } from "./Avatar.styles"

const Avatar: FC<AvatarProps> = ({
  img,
  size = "middle",
  alt,
  styleType = "light"
}) => {
  return (
    <Base size={size} styleType={styleType}>
      <ImageContainer size={size} styleType={styleType}>
        {img ? <Image src={img} alt={alt} /> : <MdPerson fontSize={24} />}
      </ImageContainer>
    </Base>
  )
}

export default Avatar

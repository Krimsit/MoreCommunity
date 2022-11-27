import { FC } from "react"

import { LikeButtonProps } from "./LikeButton.interface"

import { Base, Button, Icon, IconLiked, Count } from "./LikeButton.styles"

const LikeButton: FC<LikeButtonProps> = ({
  count,
  liked,
  onLike,
  styleType
}) => {
  return (
    <Base>
      <Button onClick={() => onLike && onLike()} styleType={styleType}>
        {!liked ? <Icon /> : <IconLiked />}
      </Button>
      {!!count && <Count>{count}</Count>}
    </Base>
  )
}

export default LikeButton

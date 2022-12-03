export interface LikeButtonProps {
  liked?: boolean
  count?: number
  onLike?: () => void
  styleType?: "dark" | "light"
  loading?: boolean
}

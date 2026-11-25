import classNames from 'classnames'
import styles from './FavoriteButton.module.scss'
import { Heart } from 'lucide-react'
import { useFavorites } from '../../store/favorites'

interface FavoriteButtonProps {
  postId: number
  title: string
}

/** Toggles a post in the favorites store and reflects its saved state. */
export function FavoriteButton({ postId, title }: FavoriteButtonProps) {
  const saved = useFavorites((state) => state.favoriteIds.includes(postId))
  const toggle = useFavorites((state) => state.toggleFavorite)

  return (
    <button
      type="button"
      className={classNames(styles.button, { [styles.selected]: saved })}
      aria-label={`Favorite: ${title}`}
      aria-pressed={saved}
      title={saved ? 'Remove from favorites' : 'Add to favorites'}
      onClick={toggleFavorite}
    >
      <Heart size={19} aria-hidden fill={saved ? 'currentColor' : 'none'} />
    </button>
  )

  function toggleFavorite() {
    toggle(postId)
  }
}

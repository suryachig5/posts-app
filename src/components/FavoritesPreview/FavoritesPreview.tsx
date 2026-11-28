import classNames from 'classnames'
import { ArrowRight, Heart } from 'lucide-react'

import type { Post } from '../../api/posts'
import { CompactPostCard } from '../CompactPostCard/CompactPostCard'

import sharedStyles from '../../styles/shared.module.scss'
import styles from './FavoritesPreview.module.scss'

interface FavoritesPreviewProps {
  posts: Post[]
  commentsFailed: boolean
  getCommentCount: (postId: number) => number | undefined
  showAll: () => void
}

const previewLimit = 4

/** Shows the most recently saved posts and a link to the full favorites list. */
export function FavoritesPreview(props: FavoritesPreviewProps) {
  const {
    posts: favoritePosts,
    commentsFailed,
    getCommentCount,
    showAll,
  } = props
  const canViewAll = favoritePosts.length > previewLimit

  return (
    <section className={styles.favorites} aria-labelledby="favorites-heading">
      <div className={classNames(sharedStyles.sectionHeading, styles.heading)}>
        <h2 id="favorites-heading">
          <Heart size={18} aria-hidden /> Favorites ({favoritePosts.length})
        </h2>
        {canViewAll && (
          <button
            className={sharedStyles.textButton}
            type="button"
            onClick={showAll}
          >
            View all favorites <ArrowRight size={16} aria-hidden />
          </button>
        )}
      </div>
      <div className={styles.cards}>
        {favoritePosts.slice(0, previewLimit).map((post) => (
          <CompactPostCard
            key={post.id}
            post={post}
            commentCount={getCommentCount(post.id)}
            commentsFailed={commentsFailed}
          />
        ))}
      </div>
    </section>
  )
}

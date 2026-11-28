import { Link } from 'react-router-dom'

import { CommentCount } from '../CommentCount/CommentCount'
import { FavoriteButton } from '../FavoriteButton/FavoriteButton'
import type { PostCardProps } from '../PostCard/PostCard'

import styles from './CompactPostCard.module.scss'

/** Renders a compact post preview for the Favorites lane. */
export function CompactPostCard(props: PostCardProps) {
  const { post, commentCount, commentsFailed } = props
  const { id, title, userId } = post

  return (
    <article className={styles.card}>
      <div className={styles.heading}>
        <h3>
          <Link className={styles.link} to={`/posts/${id}`}>
            <span className={styles.title}>{title}</span>
          </Link>
        </h3>
        <p className={styles.author}>User {userId}</p>
      </div>
      <div className={styles.footer}>
        <CommentCount
          commentCount={commentCount}
          commentsFailed={commentsFailed}
        />
        <FavoriteButton postId={id} title={title} />
      </div>
    </article>
  )
}

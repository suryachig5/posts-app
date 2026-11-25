import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { FavoriteButton } from '../FavoriteButton/FavoriteButton'
import type { PostCardProps } from '../PostCard/PostCard'
import { CommentCount } from '../CommentCount/CommentCount'
import cardStyles from '../PostCard/PostCard.module.scss'
import styles from './CompactPostCard.module.scss'

/** Renders a compact post preview for the Favorites lane. */
export function CompactPostCard(props: PostCardProps) {
  const { post, commentCount, commentsFailed } = props
  const { id, title } = post

  return (
    <article className={classNames(cardStyles.card, styles.card)}>
      <div className={cardStyles.heading}>
        <h3>
          <Link className={cardStyles.link} to={`/posts/${id}`}>
            <span className={styles.title}>{title}</span>
          </Link>
        </h3>
      </div>
      <div className={classNames(cardStyles.footer, styles.footer)}>
        <CommentCount
          commentCount={commentCount}
          commentsFailed={commentsFailed}
        />
        <FavoriteButton postId={id} title={title} />
      </div>
    </article>
  )
}

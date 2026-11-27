import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Post } from '../../api/posts'
import { CommentCount } from '../CommentCount/CommentCount'
import { FavoriteButton } from '../FavoriteButton/FavoriteButton'

import sharedStyles from '../../styles/shared.module.scss'
import styles from './PostCard.module.scss'

/** Data used by both post card variants. */
export interface PostCardProps {
  post: Post
  commentCount?: number
  commentsFailed?: boolean
}

/** Renders a post link, favorite control, and comment count. */
export function PostCard(props: PostCardProps) {
  const { post, commentCount, commentsFailed } = props
  const { id, title, body, userId } = post

  return (
    <article className={styles.card}>
      <div className={styles.heading}>
        <h3>
          <Link className={styles.link} to={`/posts/${id}`}>
            {title}
          </Link>
        </h3>
        <FavoriteButton postId={id} title={title} />
      </div>
      <p className={sharedStyles.postUser}>User {userId}</p>
      <p className={styles.body}>{body}</p>
      <div className={styles.footer}>
        <CommentCount
          commentCount={commentCount}
          commentsFailed={commentsFailed}
        />
        <ArrowUpRight size={18} aria-hidden />
      </div>
    </article>
  )
}

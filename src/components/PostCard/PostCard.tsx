import type { Post } from '../../api/posts'
import { CommentCount } from '../CommentCount/CommentCount'
import styles from './PostCard.module.scss'

interface PostCardProps {
  post: Post
  commentCount?: number
  commentsFailed: boolean
}

/** Displays a post and its comment count in the feed. */
export function PostCard(props: PostCardProps) {
  const { post, commentCount, commentsFailed } = props
  const { title, body } = post

  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
      <div className={styles.footer}>
        <CommentCount
          commentCount={commentCount}
          commentsFailed={commentsFailed}
        />
      </div>
    </article>
  )
}

import { UserRound } from 'lucide-react'

import type { Comment } from '../../api/posts'

import sharedStyles from '../../styles/shared.module.scss'
import styles from './CommentList.module.scss'

interface CommentListProps {
  comments: Comment[]
}

/** Renders the comments for a post or an empty state. */
export function CommentList({ comments }: CommentListProps) {
  return comments.length > 0 ? (
    <ul className={styles.list}>
      {comments.map((comment) => {
        const { id, name, email, body } = comment

        return (
          <li key={id} className={styles.comment}>
            <span className={styles.avatar} aria-hidden="true">
              <UserRound size={16} />
            </span>
            <div>
              <h3 className={styles.title}>{name}</h3>
              <p className={styles.email}>{email}</p>
              <p className={styles.body}>{body}</p>
            </div>
          </li>
        )
      })}
    </ul>
  ) : (
    <p className={sharedStyles.statusPanel}>No comments yet.</p>
  )
}

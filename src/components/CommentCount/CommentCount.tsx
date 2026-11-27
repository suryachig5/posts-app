import { MessageCircle } from 'lucide-react'

import { CommentCountSkeleton } from '../LoadingSkeletons/CommentCountSkeleton'

import styles from './CommentCount.module.scss'

interface CommentCountProps {
  commentCount?: number
  commentsFailed?: boolean
}

/** Displays the comment count or its loading placeholder. */
export function CommentCount(props: CommentCountProps) {
  const { commentCount, commentsFailed } = props
  return (
    <>
      {!commentsFailed && (
        <span className={styles.count}>
          {commentCount === undefined ? (
            <CommentCountSkeleton />
          ) : (
            <>
              <MessageCircle size={16} aria-hidden />
              {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
            </>
          )}
        </span>
      )}
    </>
  )
}

import classNames from 'classnames'

import styles from './LoadingSkeletons.module.scss'

/** Reserves rows for comments while a discussion is loading. */
export function CommentListSkeleton() {
  return (
    <div role="status" aria-label="Loading comments">
      <ul className={styles.commentList} aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <CommentRowSkeleton key={index} />
        ))}
      </ul>
    </div>
  )
}

function CommentRowSkeleton() {
  return (
    <li className={styles.commentRow}>
      <span className={classNames(styles.commentAvatar, styles.shimmer)} />
      <div className={styles.comment}>
        <span className={classNames(styles.shimmer, styles.commentTitle)} />
        <span className={classNames(styles.shimmer, styles.commentEmail)} />
        <span className={classNames(styles.shimmer, styles.commentBody)} />
        <span
          className={classNames(
            styles.shimmer,
            styles.commentBody,
            styles.short,
          )}
        />
      </div>
    </li>
  )
}

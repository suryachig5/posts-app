import classNames from 'classnames'
import styles from './LoadingSkeletons.module.scss'

/** Reserves space for a comment icon and count while comments load. */
export function CommentCountSkeleton() {
  return (
    <span className={styles.countLoading} aria-label="Loading comment count">
      <span
        className={classNames(styles.shimmer, styles.icon)}
        aria-hidden="true"
      />
      <span
        className={classNames(styles.shimmer, styles.count)}
        aria-hidden="true"
      />
    </span>
  )
}

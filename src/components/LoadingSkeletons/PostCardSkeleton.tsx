import classNames from 'classnames'

import styles from './LoadingSkeletons.module.scss'

/** Reserves space for a post card while its content loads. */
export function PostCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={classNames(styles.shimmer, styles.title)} />
      <div className={classNames(styles.shimmer, styles.line)} />
      <div className={classNames(styles.shimmer, styles.line, styles.short)} />
      <div className={classNames(styles.shimmer, styles.count)} />
    </div>
  )
}

import classNames from 'classnames'
import postCardStyles from '../PostCard/PostCard.module.scss'
import styles from './LoadingSkeletons.module.scss'

/** Reserves space for a post card while its content loads. */
export function PostCardSkeleton() {
  return (
    <div
      className={classNames(postCardStyles.card, styles.card)}
      aria-hidden="true"
    >
      <div className={classNames(styles.shimmer, styles.title)} />
      <div className={classNames(styles.shimmer, styles.line)} />
      <div className={classNames(styles.shimmer, styles.line, styles.short)} />
      <div className={classNames(styles.shimmer, styles.count)} />
    </div>
  )
}

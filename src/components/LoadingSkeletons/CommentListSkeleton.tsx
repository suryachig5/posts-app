import classNames from 'classnames'
import commentListStyles from '../CommentList/CommentList.module.scss'
import styles from './LoadingSkeletons.module.scss'

/** Reserves rows for comments while a discussion is loading. */
export function CommentListSkeleton() {
  return (
    <div role="status" aria-label="Loading comments">
      <ul className={commentListStyles.list} aria-hidden="true">
        {[0, 1, 2].map(renderRow)}
      </ul>
    </div>
  )
}

function renderRow(index: number) {
  return (
    <li className={commentListStyles.comment} key={index}>
      <span className={classNames(commentListStyles.avatar, styles.shimmer)} />
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

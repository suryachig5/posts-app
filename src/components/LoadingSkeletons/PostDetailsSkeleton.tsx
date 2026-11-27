import classNames from 'classnames'

import { CommentListSkeleton } from './CommentListSkeleton'

import sharedStyles from '../../styles/shared.module.scss'
import styles from './LoadingSkeletons.module.scss'

/** Reserves space for the detail article and discussion while the post loads. */
export function PostDetailsSkeleton() {
  return (
    <>
      <article
        className={styles.detailCard}
        role="status"
        aria-label="Loading post"
      >
        <div className={styles.detailHeading} aria-hidden="true">
          <h1 className={styles.detailTitle}>
            <span className={styles.shimmer} />
            <span className={styles.shimmer} />
          </h1>
          <span className={classNames(styles.shimmer, styles.heart)} />
        </div>
        <div className={styles.detailBody} aria-hidden="true">
          <span className={classNames(styles.shimmer, styles.detailLine)} />
          <span className={classNames(styles.shimmer, styles.detailLine)} />
          <span
            className={classNames(
              styles.shimmer,
              styles.detailLine,
              styles.short,
            )}
          />
        </div>
      </article>
      <section
        className={styles.detailComments}
        aria-labelledby="comments-heading"
      >
        <div
          className={classNames(
            styles.detailCommentsHeading,
            sharedStyles.sectionHeading,
          )}
        >
          <h2 id="comments-heading">Comments</h2>
        </div>
        <CommentListSkeleton />
      </section>
    </>
  )
}

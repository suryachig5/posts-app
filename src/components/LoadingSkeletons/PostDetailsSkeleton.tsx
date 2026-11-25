import classNames from 'classnames'
import sharedStyles from '../../styles/shared.module.scss'
import postCardStyles from '../PostCard/PostCard.module.scss'
import postDetailsPageStyles from '../../pages/PostDetailsPage/PostDetailsPage.module.scss'
import styles from './LoadingSkeletons.module.scss'
import { CommentListSkeleton } from './CommentListSkeleton'

/** Reserves space for the detail article and discussion while the post loads. */
export function PostDetailsSkeleton() {
  return (
    <>
      <article
        className={classNames(postCardStyles.card, postDetailsPageStyles.card)}
        role="status"
        aria-label="Loading post"
      >
        <div className={postCardStyles.heading} aria-hidden="true">
          <h1 className={styles.detailTitle}>
            <span className={styles.shimmer} />
            <span className={styles.shimmer} />
          </h1>
          <span className={classNames(styles.shimmer, styles.heart)} />
        </div>
        <div
          className={classNames(
            postDetailsPageStyles.body,
            postCardStyles.body,
          )}
          aria-hidden="true"
        >
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
        className={postDetailsPageStyles.comments}
        aria-labelledby="comments-heading"
      >
        <div
          className={classNames(
            postDetailsPageStyles.heading,
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

import { PostCardSkeleton } from './PostCardSkeleton'

import styles from './LoadingSkeletons.module.scss'

/** Shows three card placeholders while the initial feed loads. */
export function PostListSkeleton() {
  return (
    <div className={styles.postList} role="status" aria-label="Loading posts">
      {[0, 1, 2].map((index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  )
}

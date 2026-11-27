import { PostCardSkeleton } from './PostCardSkeleton'

import styles from './LoadingSkeletons.module.scss'

/** Shows three card placeholders while the initial feed loads. */
export function PostListSkeleton() {
  return (
    <div className={styles.postList} role="status" aria-label="Loading posts">
      {Array.from({ length: 3 }, renderCard)}
    </div>
  )
}

function renderCard(_value: unknown, index: number) {
  return <PostCardSkeleton key={index} />
}

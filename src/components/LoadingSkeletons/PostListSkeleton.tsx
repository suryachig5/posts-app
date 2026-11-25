import postsPageStyles from '../../pages/PostsPage/PostsPage.module.scss'
import { PostCardSkeleton } from './PostCardSkeleton'

/** Shows three card placeholders while the initial feed loads. */
export function PostListSkeleton() {
  return (
    <div
      className={postsPageStyles.list}
      role="status"
      aria-label="Loading posts"
    >
      {Array.from({ length: 3 }, renderCard)}
    </div>
  )
}

function renderCard(_value: unknown, index: number) {
  return <PostCardSkeleton key={index} />
}

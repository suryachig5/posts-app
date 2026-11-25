import type { Post } from '../../api/posts'
import { PostListSkeleton } from '../../components/LoadingSkeletons/PostListSkeleton'
import { PostCard } from '../../components/PostCard/PostCard'
import { RetryNotice } from '../../components/RetryNotice/RetryNotice'
import { usePostsList } from '../../hooks/usePostsList'
import sharedStyles from '../../styles/shared.module.scss'
import styles from './PostsPage.module.scss'

/** Renders the post feed and handles independent post and comment requests. */
export function PostsPage() {
  const { posts, comments } = usePostsList()
  const commentsFailed = comments.isError && !comments.data

  return (
    <>
      <h1 className={styles.title}>Posts</h1>
      <section aria-labelledby="feed-heading">
        <div className={sharedStyles.sectionHeading}>
          <h2 id="feed-heading">All posts</h2>
          {posts.data && (
            <span className={sharedStyles.resultCount} role="status">
              {posts.data.length} {posts.data.length === 1 ? 'post' : 'posts'}
            </span>
          )}
        </div>
        {commentsFailed && posts.data && (
          <RetryNotice
            message="We couldn’t load comments."
            retry={comments.refetch}
            retrying={comments.isFetching}
          />
        )}
        {renderPosts()}
      </section>
    </>
  )

  function renderPosts() {
    if (posts.isPending) return <PostListSkeleton />
    if (!posts.data) {
      return (
        <RetryNotice
          message="We couldn’t load the posts."
          retry={posts.refetch}
          retrying={posts.isFetching}
        />
      )
    }
    if (posts.data.length === 0) {
      return <p className={sharedStyles.statusPanel}>No posts to display.</p>
    }

    return <ul className={styles.list}>{posts.data.map(renderPost)}</ul>
  }

  function renderPost(post: Post) {
    const commentCount = comments.data
      ? (comments.data.get(post.id)?.length ?? 0)
      : undefined

    return (
      <li key={post.id}>
        <PostCard
          post={post}
          commentCount={commentCount}
          commentsFailed={commentsFailed}
        />
      </li>
    )
  }
}

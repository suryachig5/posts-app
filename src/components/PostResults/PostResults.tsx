import type { Ref } from 'react'

import type { Post } from '../../api/posts'
import { PostListSkeleton } from '../LoadingSkeletons/PostListSkeleton'
import { PostCard } from '../PostCard/PostCard'
import { RetryNotice } from '../RetryNotice/RetryNotice'

import sharedStyles from '../../styles/shared.module.scss'
import styles from './PostResults.module.scss'

interface RetryAction {
  run: () => void
  pending: boolean
}

interface PostResultsProps {
  resultsRef: Ref<HTMLElement>
  onReset?: () => void
  filters: {
    userId: number | null
    favoritesOnly: boolean
    normalizedSearchValue: string
  }
  posts: {
    visible?: Post[]
    loading: boolean
    retry?: RetryAction
  }
  comments: {
    getCount: (postId: number) => number | undefined
    retry?: RetryAction
  }
}

interface PostResultsListProps {
  posts: Post[]
  getCommentCount: PostResultsProps['comments']['getCount']
  commentsFailed: boolean
  normalizedSearchValue: string
  favoritesOnly: boolean
}

/**
 * Shows the post cards and result count. Shows placeholders while posts load,
 * a message when there are no results, and a retry button if a request fails.
 */
export function PostResults(props: PostResultsProps) {
  const { filters, posts, comments, resultsRef, onReset } = props
  const { favoritesOnly, normalizedSearchValue, userId } = filters
  const {
    visible: visiblePosts,
    loading: loadingPosts,
    retry: retryPosts,
  } = posts
  const { getCount: getCommentCount, retry: retryComments } = comments
  const commentsFailed = Boolean(retryComments)

  return (
    <section ref={resultsRef} aria-labelledby="feed-heading">
      <div className={sharedStyles.sectionHeading}>
        <h2 id="feed-heading">{getFeedHeading(favoritesOnly, userId)}</h2>
        {visiblePosts && (
          <div className={styles.resultActions}>
            <span className={sharedStyles.resultCount} role="status">
              {visiblePosts.length}{' '}
              {visiblePosts.length === 1 ? 'post' : 'posts'}
            </span>
            {onReset && (
              <button
                className={sharedStyles.textButton}
                type="button"
                onClick={onReset}
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>
      {retryComments && visiblePosts && (
        <RetryNotice
          message="We couldn’t load comments."
          retry={retryComments.run}
          retrying={retryComments.pending}
        />
      )}
      {loadingPosts && <PostListSkeleton />}
      {retryPosts && (
        <RetryNotice
          message="We couldn’t load the posts."
          retry={retryPosts.run}
          retrying={retryPosts.pending}
        />
      )}
      {visiblePosts && (
        <PostResultsList
          posts={visiblePosts}
          getCommentCount={getCommentCount}
          commentsFailed={commentsFailed}
          normalizedSearchValue={normalizedSearchValue}
          favoritesOnly={favoritesOnly}
        />
      )}
    </section>
  )
}

function getFeedHeading(favoritesOnly: boolean, userId: number | null) {
  let heading: string

  if (favoritesOnly) {
    heading = 'Favorite posts'
  } else if (userId === null) {
    heading = 'All posts'
  } else {
    heading = `Posts by User ${userId}`
  }

  return heading
}

function PostResultsList(props: PostResultsListProps) {
  const {
    posts,
    getCommentCount,
    commentsFailed,
    normalizedSearchValue,
    favoritesOnly,
  } = props
  if (!posts.length) {
    return (
      <p className={sharedStyles.statusPanel}>
        {getEmptyMessage(normalizedSearchValue, favoritesOnly)}
      </p>
    )
  }

  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard
            post={post}
            commentCount={getCommentCount(post.id)}
            commentsFailed={commentsFailed}
          />
        </li>
      ))}
    </ul>
  )
}

function getEmptyMessage(
  normalizedSearchValue: string,
  favoritesOnly: boolean,
) {
  let message: string

  if (normalizedSearchValue) {
    message = 'No posts match your search.'
  } else if (favoritesOnly) {
    message = 'Your favorites will appear here.'
  } else {
    message = 'No posts to display.'
  }

  return message
}

import { useEffect, useRef, useState } from 'react'
import { FeedControls } from '../../components/FeedControls/FeedControls'
import { useFeedFilter } from '../../store/feedFilter'
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
  const { search, setSearch } = useFeedFilter()
  const term = search.trim().toLowerCase()
  const { headingRef, controlsMarkerRef, showCompactTitle, controlsPinned } =
    useStickyControls()
  const visiblePosts = getMatchingPosts(posts.data ?? [], term)
  const commentsFailed = comments.isError && !comments.data

  return (
    <>
      <div className={styles.heading} ref={headingRef}>
        <h1>Posts</h1>
      </div>
      <div
        className={styles.marker}
        ref={controlsMarkerRef}
        aria-hidden="true"
      />
      {!!posts.data?.length && (
        <FeedControls
          showCompactTitle={showCompactTitle}
          pinned={controlsPinned}
          search={search}
          onSearch={setSearch}
        />
      )}
      <section aria-labelledby="feed-heading">
        <div className={sharedStyles.sectionHeading}>
          <h2 id="feed-heading">All posts</h2>
          {posts.data && (
            <span className={sharedStyles.resultCount} role="status">
              {visiblePosts.length}{' '}
              {visiblePosts.length === 1 ? 'post' : 'posts'}
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
    if (visiblePosts.length === 0) {
      return (
        <p className={sharedStyles.statusPanel}>
          {term ? 'No posts match your search.' : 'No posts to display.'}
        </p>
      )
    }

    return <ul className={styles.list}>{visiblePosts.map(renderPost)}</ul>
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

function getMatchingPosts(posts: Post[], term: string) {
  return posts.filter((post) => {
    const { title, body } = post
    return (
      title.toLowerCase().includes(term) || body.toLowerCase().includes(term)
    )
  })
}

function useStickyControls() {
  const headingRef = useRef<HTMLDivElement>(null)
  const controlsMarkerRef = useRef<HTMLDivElement>(null)
  const [showCompactTitle, setShowCompactTitle] = useState(false)
  const [controlsPinned, setControlsPinned] = useState(false)

  useEffect(() => {
    const heading = headingRef.current
    const marker = controlsMarkerRef.current
    if (!heading || !marker) return

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const aboveViewport =
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0
        if (entry.target === heading) setShowCompactTitle(aboveViewport)
        else setControlsPinned(aboveViewport)
      }
    })
    observer.observe(heading)
    observer.observe(marker)
    return () => observer.disconnect()
  }, [])
  return { headingRef, controlsMarkerRef, showCompactTitle, controlsPinned }
}

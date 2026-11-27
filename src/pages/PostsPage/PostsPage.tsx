import { ArrowRight, Heart } from 'lucide-react'
import type { Ref } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import type { Post } from '../../api/posts'
import { CompactPostCard } from '../../components/CompactPostCard/CompactPostCard'
import { FeedControls } from '../../components/FeedControls/FeedControls'
import { PostListSkeleton } from '../../components/LoadingSkeletons/PostListSkeleton'
import { PostCard } from '../../components/PostCard/PostCard'
import { RetryNotice } from '../../components/RetryNotice/RetryNotice'
import { usePostsList } from '../../hooks/usePostsList'
import { useFavorites } from '../../store/favorites'
import { useFeedFilter } from '../../store/feedFilter'

import sharedStyles from '../../styles/shared.module.scss'
import styles from './PostsPage.module.scss'

type PostsQuery = ReturnType<typeof usePostsList>['posts']
type CommentsQuery = ReturnType<typeof usePostsList>['comments']

interface FavoritesPreviewProps {
  posts: Post[]
  comments: CommentsQuery
  showAll: () => void
}

interface PostFeedProps {
  resultsRef: Ref<HTMLElement>
  onReset?: () => void
  userId: number | null
  posts: PostsQuery
  comments: CommentsQuery
  visiblePosts: Post[]
  favoritesOnly: boolean
  normalizedSearchValue: string
}

const previewLimit = 4

/** Renders the post feed, search and filters, and a preview of saved posts. */
export function PostsPage() {
  const { posts, comments } = usePostsList()
  const favoriteIds = useFavorites((state) => state.favoriteIds)
  const {
    resetFilters,
    search,
    setSearch,
    favoritesOnly,
    setFavoritesOnly,
    userId,
    setUserId,
  } = useFeedFilter()
  const controlsRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLElement>(null)
  const normalizedSearchValue = search.trim().toLowerCase()
  const { headingRef, controlsMarkerRef, showCompactTitle, controlsPinned } =
    useStickyControls()

  const entries = posts.data ?? []
  const favoritePosts = getFavoritePosts(entries, favoriteIds)
  const scopedPosts = favoritesOnly ? favoritePosts : entries
  const userIds = getUserIds(scopedPosts)
  const selectedUserId =
    userId !== null && userIds.includes(userId) ? userId : null
  const visiblePosts = getMatchingPosts(
    scopedPosts,
    normalizedSearchValue,
    selectedUserId,
  )
  const showPreview =
    !favoritesOnly &&
    !normalizedSearchValue &&
    selectedUserId === null &&
    favoritePosts.length > 0

  const previousFilters = useRef({ search, favoritesOnly, userId })
  useLayoutEffect(() => {
    const previous = previousFilters.current
    previousFilters.current = { search, favoritesOnly, userId }
    if (
      previous.search === search &&
      previous.favoritesOnly === favoritesOnly &&
      previous.userId === userId
    )
      return

    const controls = controlsRef.current
    const results = resultsRef.current
    if (!controls || !results) return

    const offset = results.getBoundingClientRect().top - controls.offsetHeight
    if (offset < -1) {
      window.scrollTo({ top: window.scrollY + offset, behavior: 'instant' })
    }
  }, [search, favoritesOnly, userId])

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
      {entries.length > 0 && (
        <FeedControls
          controlsRef={controlsRef}
          showCompactTitle={showCompactTitle}
          pinned={controlsPinned}
          userIds={userIds}
          userId={selectedUserId}
          onChangeUser={setUserId}
          search={search}
          favoritesOnly={favoritesOnly}
          onSearch={setSearch}
          onChangeFilter={setFavoritesOnly}
        />
      )}
      {showPreview && (
        <FavoritesPreview
          posts={favoritePosts}
          comments={comments}
          showAll={showAllFavorites}
        />
      )}
      <PostFeed
        resultsRef={resultsRef}
        onReset={
          search !== '' || favoritesOnly || userId !== null
            ? resetFilters
            : undefined
        }
        userId={selectedUserId}
        posts={posts}
        comments={comments}
        visiblePosts={visiblePosts}
        favoritesOnly={favoritesOnly}
        normalizedSearchValue={normalizedSearchValue}
      />
    </>
  )

  function showAllFavorites() {
    setFavoritesOnly(true)
  }
}

function FavoritesPreview(props: FavoritesPreviewProps) {
  const { posts: favoritePosts, comments, showAll } = props
  const canViewAll = favoritePosts.length > previewLimit
  const commentsFailed = comments.isError && !comments.data

  return (
    <section className={styles.favorites} aria-labelledby="favorites-heading">
      <div className={sharedStyles.sectionHeading}>
        <h2 id="favorites-heading">
          <Heart size={18} aria-hidden /> Favorites ({favoritePosts.length})
        </h2>
        <button
          className={sharedStyles.textButton}
          type="button"
          disabled={!canViewAll}
          aria-hidden={!canViewAll}
          onClick={showAll}
        >
          View all favorites <ArrowRight size={16} aria-hidden />
        </button>
      </div>
      <div className={styles.cards}>
        {favoritePosts.slice(0, previewLimit).map((post) => (
          <CompactPostCard
            key={post.id}
            post={post}
            commentCount={getCommentCount(comments, post.id)}
            commentsFailed={commentsFailed}
          />
        ))}
      </div>
    </section>
  )
}

function getCommentCount(comments: CommentsQuery, postId: number) {
  return comments.data ? (comments.data.get(postId)?.length ?? 0) : undefined
}

function PostFeed(props: PostFeedProps) {
  const {
    posts,
    comments,
    visiblePosts,
    resultsRef,
    favoritesOnly,
    normalizedSearchValue,
    userId,
    onReset,
  } = props
  const commentsFailed = comments.isError && !comments.data

  return (
    <section ref={resultsRef} aria-labelledby="feed-heading">
      <div className={sharedStyles.sectionHeading}>
        <h2 id="feed-heading">
          {favoritesOnly
            ? 'Favorite posts'
            : userId === null
              ? 'All posts'
              : `Posts by User ${userId}`}
        </h2>
        {posts.data && (
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
      {commentsFailed && posts.data && (
        <RetryNotice
          message="We couldn’t load comments."
          retry={comments.refetch}
          retrying={comments.isFetching}
        />
      )}
      {posts.isPending && <PostListSkeleton />}
      {posts.isError && !posts.data && (
        <RetryNotice
          message="We couldn’t load the posts."
          retry={posts.refetch}
          retrying={posts.isFetching}
        />
      )}
      {posts.data &&
        renderPostResults(
          visiblePosts,
          comments,
          normalizedSearchValue,
          favoritesOnly,
        )}
    </section>
  )
}

function renderPostResults(
  posts: Post[],
  comments: CommentsQuery,
  normalizedSearchValue: string,
  favoritesOnly: boolean,
) {
  if (!posts.length) {
    return (
      <p className={sharedStyles.statusPanel}>
        {getEmptyMessage(normalizedSearchValue, favoritesOnly)}
      </p>
    )
  }

  const commentsFailed = comments.isError && !comments.data
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard
            post={post}
            commentCount={getCommentCount(comments, post.id)}
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
  if (normalizedSearchValue) return 'No posts match your search.'
  if (favoritesOnly) return 'Your favorites will appear here.'
  return 'No posts to display.'
}

function getUserIds(posts: Post[]) {
  return [...new Set(posts.map(({ userId }) => userId))].sort((a, b) => a - b)
}

function getFavoritePosts(posts: Post[], favoriteIds: number[]) {
  const postById = new Map(posts.map((post) => [post.id, post]))
  return favoriteIds
    .map((id) => postById.get(id))
    .filter((post) => post !== undefined)
}

function getMatchingPosts(
  posts: Post[],
  normalizedSearchValue: string,
  userId: number | null,
) {
  return posts.filter((post) => {
    if (userId !== null && post.userId !== userId) return false
    const { title, body } = post
    return (
      title.toLowerCase().includes(normalizedSearchValue) ||
      body.toLowerCase().includes(normalizedSearchValue)
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

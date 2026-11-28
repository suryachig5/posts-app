import { FavoritesPreview } from '../../components/FavoritesPreview/FavoritesPreview'
import { FeedControls } from '../../components/FeedControls/FeedControls'
import { PostResults } from '../../components/PostResults/PostResults'
import { usePostsList } from '../../hooks/usePostsList'
import { useFavorites } from '../../store/favorites'
import { useFeedFilter } from '../../store/feedFilter'
import { getPostsPageDisplayData } from './getPostsPageDisplayData'
import { useStickyControls } from './useStickyControls'

import styles from './PostsPage.module.scss'

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
  const {
    controlsRef,
    resultsRef,
    headingRef,
    controlsMarkerRef,
    showCompactTitle,
    controlsPinned,
  } = useStickyControls(search, favoritesOnly, userId)
  const entries = posts.data ?? []
  const {
    favoritePosts,
    normalizedSearchValue,
    selectedUserId,
    showPreview,
    userIds,
    visiblePosts,
  } = getPostsPageDisplayData(
    entries,
    favoriteIds,
    search,
    favoritesOnly,
    userId,
  )
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
          commentsFailed={commentsFailed}
          getCommentCount={getCommentCount}
          showAll={showAllFavorites}
        />
      )}
      <PostResults
        resultsRef={resultsRef}
        onReset={
          search !== '' || favoritesOnly || userId !== null
            ? resetFilters
            : undefined
        }
        userId={selectedUserId}
        loadingPosts={posts.isPending}
        retryPosts={
          posts.isError && !posts.data
            ? { run: posts.refetch, pending: posts.isFetching }
            : undefined
        }
        retryComments={
          commentsFailed
            ? { run: comments.refetch, pending: comments.isFetching }
            : undefined
        }
        getCommentCount={getCommentCount}
        visiblePosts={posts.data ? visiblePosts : undefined}
        favoritesOnly={favoritesOnly}
        normalizedSearchValue={normalizedSearchValue}
      />
    </>
  )

  function showAllFavorites() {
    setFavoritesOnly(true)
  }

  function getCommentCount(postId: number) {
    return comments.data ? (comments.data.get(postId)?.length ?? 0) : undefined
  }
}

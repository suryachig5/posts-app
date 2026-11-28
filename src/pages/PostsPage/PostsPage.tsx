import { FavoritesPreview } from '../../components/FavoritesPreview/FavoritesPreview'
import { FeedControls } from '../../components/FeedControls/FeedControls'
import { PostResults } from '../../components/PostResults/PostResults'
import { getPostsPageDisplayData } from '../../helpers/getPostsPageDisplayData'
import { usePostsList } from '../../hooks/usePostsList'
import { useStickyControls } from '../../hooks/useStickyControls'
import { useFavorites } from '../../store/favorites'
import { useFeedFilter } from '../../store/feedFilter'

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
  } = getPostsPageDisplayData({
    entries,
    favoriteIds,
    search,
    favoritesOnly,
    userId,
  })
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
      {entries.length > 0 && <FeedControls {...getFeedControlsProps()} />}
      {showPreview && <FavoritesPreview {...getFavoritesPreviewProps()} />}
      <PostResults {...getPostResultsProps()} />
    </>
  )

  function getFeedControlsProps() {
    return {
      controlsRef,
      showCompactTitle,
      pinned: controlsPinned,
      userIds,
      userId: selectedUserId,
      onChangeUser: setUserId,
      search,
      favoritesOnly,
      onSearch: setSearch,
      onChangeFilter: setFavoritesOnly,
    }
  }

  function getFavoritesPreviewProps() {
    return {
      posts: favoritePosts,
      commentsFailed,
      getCommentCount,
      showAll: showAllFavorites,
    }
  }

  function getPostResultsProps() {
    return {
      resultsRef,
      onReset:
        search !== '' || favoritesOnly || userId !== null
          ? resetFilters
          : undefined,
      filters: {
        userId: selectedUserId,
        favoritesOnly,
        normalizedSearchValue,
      },
      posts: {
        visible: posts.data ? visiblePosts : undefined,
        loading: posts.isPending,
        retry:
          posts.isError && !posts.data
            ? { run: posts.refetch, pending: posts.isFetching }
            : undefined,
      },
      comments: {
        getCount: getCommentCount,
        retry: commentsFailed
          ? { run: comments.refetch, pending: comments.isFetching }
          : undefined,
      },
    }
  }

  function getCommentCount(postId: number) {
    return comments.data ? (comments.data.get(postId)?.length ?? 0) : undefined
  }

  function showAllFavorites() {
    setFavoritesOnly(true)
  }
}

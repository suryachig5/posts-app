import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favoriteIds: number[]
  toggleFavorite: (postId: number) => void
}

/**
 * Persists favorite post IDs in localStorage so saved posts survive a reload.
 * Storing only IDs keeps the saved list independent of cached post content,
 * which the feed reads from TanStack Query.
 */
export const useFavorites = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggleFavorite: (postId) =>
        set(({ favoriteIds }) => ({
          favoriteIds: favoriteIds.includes(postId)
            ? favoriteIds.filter((id) => id !== postId)
            : [postId, ...favoriteIds],
        })),
    }),
    {
      name: 'posts-app-favorites',
      partialize: ({ favoriteIds }) => ({ favoriteIds }),
    },
  ),
)

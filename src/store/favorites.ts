import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favoriteIds: number[]
  toggleFavorite: (postId: number) => void
}

/** Tracks favorite post IDs and persists them in local storage. */
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

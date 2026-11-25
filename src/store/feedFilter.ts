import { create } from 'zustand'

interface FeedFilterState {
  resetFilters: () => void
  userId: number | null
  setUserId: (userId: number | null) => void
  showPostsByUser: (userId: number) => void
  search: string
  setSearch: (search: string) => void
  favoritesOnly: boolean
  setFavoritesOnly: (favoritesOnly: boolean) => void
}

/**
 * Keeps search text, the selected user, and the Favorites filter in memory.
 * These settings survive route changes and reset on a full page reload.
 */
export const useFeedFilter = create<FeedFilterState>((set) => ({
  resetFilters: () => set({ userId: null, search: '', favoritesOnly: false }),
  userId: null,
  setUserId: (userId) => set({ userId }),
  showPostsByUser: (userId) =>
    set({ userId, search: '', favoritesOnly: false }),
  search: '',
  setSearch: (search) => set({ search }),
  favoritesOnly: false,
  setFavoritesOnly: (favoritesOnly) => set({ favoritesOnly }),
}))

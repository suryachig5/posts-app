import { create } from 'zustand'

interface FeedFilterState {
  search: string
  setSearch: (search: string) => void
  favoritesOnly: boolean
  setFavoritesOnly: (favoritesOnly: boolean) => void
}

/** Keeps search and filter settings in memory across page navigation. */
export const useFeedFilter = create<FeedFilterState>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
  favoritesOnly: false,
  setFavoritesOnly: (favoritesOnly) => set({ favoritesOnly }),
}))

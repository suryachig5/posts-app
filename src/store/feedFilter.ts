import { create } from 'zustand'

interface FeedFilterState {
  search: string
  setSearch: (search: string) => void
}

/** Keeps search settings in memory across page navigation. */
export const useFeedFilter = create<FeedFilterState>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
}))

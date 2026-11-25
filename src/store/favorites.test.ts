import { beforeEach, describe, expect, it } from '@jest/globals'
import { useFavorites } from './favorites'

beforeEach(() => {
  useFavorites.setState({ favoriteIds: [] })
})

describe('favorites store', () => {
  it('should add newest favorites first and remove a favorite when toggled again', () => {
    const { toggleFavorite } = useFavorites.getState()
    toggleFavorite(1)
    toggleFavorite(2)
    expect(useFavorites.getState().favoriteIds).toEqual([2, 1])
    toggleFavorite(1)
    expect(useFavorites.getState().favoriteIds).toEqual([2])
  })

  it('should rehydrate favorite IDs from local storage', async () => {
    localStorage.setItem(
      'posts-app-favorites',
      JSON.stringify({ state: { favoriteIds: [7] }, version: 0 }),
    )
    await useFavorites.persist.rehydrate()
    expect(useFavorites.getState().favoriteIds).toEqual([7])
  })
})

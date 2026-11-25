import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it } from '@jest/globals'
import { FavoriteButton } from './FavoriteButton'
import { useFavorites } from '../../store/favorites'
import { firstPost } from '../../test/mockData'

beforeEach(() => {
  useFavorites.setState({ favoriteIds: [] })
})

it('should toggle the favorite button and its accessible pressed state', async () => {
  const user = userEvent.setup()
  render(<FavoriteButton postId={1} title={firstPost.title} />)
  const button = screen.getByRole('button', {
    name: 'Favorite: First post',
    pressed: false,
  })
  await user.click(button)
  expect(button.getAttribute('aria-pressed')).toBe('true')
  expect(useFavorites.getState().favoriteIds).toEqual([1])
  await user.click(button)
  expect(button.getAttribute('aria-pressed')).toBe('false')
})

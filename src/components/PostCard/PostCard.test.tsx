import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, it } from '@jest/globals'
import { PostCard } from './PostCard'
import { useFavorites } from '../../store/favorites'
import { firstPost } from '../../test/mockData'

beforeEach(() => {
  useFavorites.setState({ favoriteIds: [] })
})

it('should show the post link, body, and comment count', () => {
  render(<PostCard post={firstPost} commentCount={1} />, {
    wrapper: MemoryRouter,
  })
  expect(
    screen.getByRole('link', { name: firstPost.title }).getAttribute('href'),
  ).toBe('/posts/1')
  expect(screen.getByText(firstPost.body)).toBeTruthy()
  expect(screen.getByText('1 comment')).toBeTruthy()
})

it('should show the loading count and hide it when comments fail', () => {
  const { rerender } = render(<PostCard post={firstPost} />, {
    wrapper: MemoryRouter,
  })
  expect(screen.getByLabelText('Loading comment count')).toBeTruthy()

  rerender(<PostCard post={firstPost} commentsFailed />)

  expect(screen.queryByLabelText('Loading comment count')).toBeNull()
})

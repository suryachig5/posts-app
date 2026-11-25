import postCardStyles from './PostCard.module.scss'
import loadingSkeletonsStyles from '../LoadingSkeletons/LoadingSkeletons.module.scss'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, it } from '@jest/globals'
import { PostCardSkeleton } from '../LoadingSkeletons/PostCardSkeleton'
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

it('should distinguish loading and failed counts and hide the decorative card skeleton', () => {
  const { rerender, container } = render(<PostCard post={firstPost} />, {
    wrapper: MemoryRouter,
  })
  expect(screen.getByLabelText('Loading comment count')).toBeTruthy()
  expect(
    container.querySelector(
      `.${loadingSkeletonsStyles.icon}.${loadingSkeletonsStyles.shimmer}`,
    ),
  ).toBeTruthy()
  expect(container.querySelector(`.${postCardStyles.count} svg`)).toBeNull()
  rerender(<PostCard post={firstPost} commentsFailed />)
  expect(container.querySelector(`.${postCardStyles.count}`)).toBeNull()
  rerender(<PostCardSkeleton />)
  expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
})

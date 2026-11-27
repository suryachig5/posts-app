import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'

import { AppRoutes } from './AppRoutes'

vi.mock('../pages/PostsPage/PostsPage', () => ({
  PostsPage: () => <h1>Feed</h1>,
}))
vi.mock('../pages/PostDetailsPage/PostDetailsPage', () => ({
  __esModule: true,
  default: () => <h1>Details</h1>,
}))

it('should open the feed and focus the main content', () => {
  render(
    <MemoryRouter>
      <AppRoutes />
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { name: 'Feed' })).toBeTruthy()
  expect(document.activeElement).toBe(screen.getByRole('main'))
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
})

it('should load the detail route on a direct visit', async () => {
  render(
    <MemoryRouter initialEntries={['/posts/1']}>
      <AppRoutes />
    </MemoryRouter>,
  )
  expect(screen.getByRole('status', { name: 'Loading post' })).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Back to posts' }).getAttribute('href'),
  ).toBe('/')
  expect(screen.getByRole('region', { name: 'Comments' })).toBeTruthy()
  expect(screen.getByRole('status', { name: 'Loading comments' })).toBeTruthy()
  expect(await screen.findByRole('heading', { name: 'Details' })).toBeTruthy()
})

it('should link back to the feed from an unknown route', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={['/unknown']}>
      <AppRoutes />
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeTruthy()
  await user.click(screen.getByRole('link', { name: 'Back to posts' }))
  expect(screen.getByRole('heading', { name: 'Feed' })).toBeTruthy()
})

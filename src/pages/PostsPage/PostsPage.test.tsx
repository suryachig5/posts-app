import postsPageStyles from './PostsPage.module.scss'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, it, jest } from '@jest/globals'
import { fetchComments, fetchPosts } from '../../api/posts'
import { useFavorites } from '../../store/favorites'
import { useFeedFilter } from '../../store/feedFilter'
import { firstComment, firstPost, secondPost } from '../../test/mockData'
import { createQueryHarness } from '../../test/queryHarness'
import { PostsPage } from './PostsPage'

jest.mock('../../api/posts')

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(fetchPosts).mockResolvedValue([firstPost, secondPost])
  jest.mocked(fetchComments).mockResolvedValue([firstComment])
  useFavorites.setState({ favoriteIds: [] })
  useFeedFilter.setState({ search: '', favoritesOnly: false, userId: null })
})

function renderFeed() {
  const { wrapper: QueryProvider } = createQueryHarness()
  render(
    <QueryProvider>
      <MemoryRouter>
        <PostsPage />
      </MemoryRouter>
    </QueryProvider>,
  )
}

it('should load the feed and search titles and bodies case-insensitively', async () => {
  const user = userEvent.setup()
  renderFeed()
  expect(screen.getByRole('status', { name: 'Loading posts' })).toBeTruthy()
  expect(screen.queryByRole('searchbox')).toBeNull()
  expect(screen.queryByRole('group', { name: 'Filter posts' })).toBeNull()
  expect(await screen.findByText('1 comment')).toBeTruthy()
  expect(screen.getByText('0 comments')).toBeTruthy()
  expect(screen.getByRole('group', { name: 'Filter posts' })).toBeTruthy()
  const search = screen.getByRole('searchbox')
  await user.type(search, ' ORANGE ')
  expect(screen.getByRole('link', { name: secondPost.title })).toBeTruthy()
  expect(screen.queryByRole('link', { name: firstPost.title })).toBeNull()
  await user.clear(search)
  await user.type(search, 'FIRST POST')
  expect(screen.getByRole('link', { name: firstPost.title })).toBeTruthy()
  await user.type(search, 'xyz')
  expect(screen.getByText('No posts match your search.')).toBeTruthy()
})

it('should show up to four favorites and switch to the complete saved list', async () => {
  const user = userEvent.setup()
  const posts = Array.from({ length: 5 }, (_, i) => ({
    ...firstPost,
    id: i + 1,
    title: `Saved post ${i + 1}`,
  }))
  jest.mocked(fetchPosts).mockResolvedValue(posts)
  useFavorites.setState({ favoriteIds: [1, 2, 3, 4, 5] })
  renderFeed()
  const preview = await screen.findByRole('region', { name: 'Favorites (5)' })
  expect(within(preview).getAllByRole('article')).toHaveLength(4)
  await user.click(
    within(preview).getByRole('button', { name: 'View all favorites' }),
  )
  const feed = screen.getByRole('region', { name: 'Favorite posts' })
  expect(within(feed).getAllByRole('article')).toHaveLength(5)
  expect(screen.queryByRole('region', { name: 'Favorites (5)' })).toBeNull()
})

it('should show a saved-list empty state when there are no favorites', async () => {
  const user = userEvent.setup()
  renderFeed()
  await screen.findByText(firstPost.title)
  await user.click(screen.getByRole('button', { name: 'Favorites' }))
  expect(screen.getByText('Your favorites will appear here.')).toBeTruthy()
})

it('should retry a failed post request and handle an empty feed', async () => {
  const user = userEvent.setup()
  jest
    .mocked(fetchPosts)
    .mockRejectedValueOnce(new Error('Oops'))
    .mockResolvedValue([])
  renderFeed()
  expect(await screen.findByText('We couldn’t load the posts.')).toBeTruthy()
  await user.click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByText('No posts to display.')).toBeTruthy()
})

it('should keep posts visible and retry when only comment counts fail', async () => {
  const user = userEvent.setup()
  jest.mocked(fetchComments).mockRejectedValueOnce(new Error('Oops'))
  renderFeed()
  expect(await screen.findByText('We couldn’t load comments.')).toBeTruthy()
  expect(screen.getByRole('link', { name: firstPost.title })).toBeTruthy()
  await user.click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByText('1 comment')).toBeTruthy()
})

it('should update the sticky toolbar when the heading and marker scroll away', async () => {
  let onIntersection: IntersectionObserverCallback
  const disconnect = jest.fn()
  class Observer {
    constructor(callback: IntersectionObserverCallback) {
      onIntersection = callback
    }

    observe() {}
    disconnect = disconnect
  }

  const originalObserver = globalThis.IntersectionObserver
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    value: Observer,
  })
  try {
    renderFeed()
    await screen.findByText(firstPost.title)
    const toolbar = screen.getByRole('search').parentElement
    const heading = screen.getByRole('heading', {
      name: 'Posts',
      level: 1,
    }).parentElement
    const marker = document.querySelector(`.${postsPageStyles.marker}`)
    act(() => {
      const entries = [heading, marker].map((target) => ({
        target,
        isIntersecting: false,
        boundingClientRect: { bottom: -1 },
      }))
      onIntersection(
        entries as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      )
    })
    expect(toolbar?.dataset.compactTitle).toBe('true')
    expect(toolbar?.dataset.pinned).toBe('true')
  } finally {
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: originalObserver,
    })
  }
})

it('should offer only users with saved posts in Favorites', async () => {
  const user = userEvent.setup()
  jest
    .mocked(fetchPosts)
    .mockResolvedValue([firstPost, { ...secondPost, userId: 2 }])
  useFavorites.setState({ favoriteIds: [firstPost.id] })
  useFeedFilter.setState({ userId: 2 })
  renderFeed()

  await user.click(await screen.findByRole('button', { name: 'Favorites' }))
  const trigger = screen.getByRole('button', {
    name: 'Filter by user: All users',
  })
  await user.click(trigger)
  expect(screen.getByRole('button', { name: 'User 1' })).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'User 2' })).toBeNull()
  await user.click(screen.getByRole('button', { name: 'User 1' }))
  expect(screen.getByRole('link', { name: firstPost.title })).toBeTruthy()

  await user.click(screen.getByRole('button', { name: 'All posts' }))
  await user.click(
    screen.getByRole('button', { name: 'Filter by user: User 1' }),
  )
  expect(screen.getByRole('button', { name: 'User 2' })).toBeTruthy()
})

it('should reset search, user, and Favorites without removing saved posts', async () => {
  const user = userEvent.setup()
  useFavorites.setState({ favoriteIds: [firstPost.id] })
  useFeedFilter.setState({ search: 'no match', userId: 1, favoritesOnly: true })
  renderFeed()

  const results = await screen.findByRole('region', { name: 'Favorite posts' })
  expect(await within(results).findByText('0 posts')).toBeTruthy()
  await user.click(
    within(results).getByRole('button', { name: 'Reset filters' }),
  )

  expect(screen.getByRole<HTMLInputElement>('searchbox').value).toBe('')
  expect(
    screen.getByRole('button', { name: 'Filter by user: All users' }),
  ).toBeTruthy()
  expect(
    screen.getByRole('button', { name: 'All posts', pressed: true }),
  ).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Reset filters' })).toBeNull()
  expect(useFavorites.getState().favoriteIds).toEqual([firstPost.id])
})

it('should return to results below the toolbar without moving focus as search continues', async () => {
  const user = userEvent.setup()
  renderFeed()
  const search = await screen.findByRole('searchbox', { name: 'Search posts' })
  const toolbar = screen.getByRole('search').parentElement!
  const results = screen.getByRole('region', { name: 'All posts' })
  Object.defineProperty(toolbar, 'offsetHeight', { value: 80 })
  const bounds = jest
    .spyOn(results, 'getBoundingClientRect')
    .mockReturnValue(new DOMRect(0, 30))
  const scrollTo = jest.mocked(window.scrollTo)
  scrollTo.mockClear()

  await user.type(search, 'a')

  expect(scrollTo).toHaveBeenCalledWith({
    top: window.scrollY - 50,
    behavior: 'instant',
  })
  expect(document.activeElement).toBe(search)

  bounds.mockReturnValue(new DOMRect(0, 80))
  await user.type(search, 'p')
  expect(scrollTo).toHaveBeenCalledTimes(1)
  expect(document.activeElement).toBe(search)

  bounds.mockReturnValue(new DOMRect(0, 20))
  await user.click(screen.getByRole('button', { name: 'Favorites' }))
  expect(scrollTo).toHaveBeenLastCalledWith({
    top: window.scrollY - 60,
    behavior: 'instant',
  })
})

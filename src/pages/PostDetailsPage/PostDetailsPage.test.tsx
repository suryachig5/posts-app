import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, expect, it, vi } from 'vitest'

import { fetchComments, fetchIndividualPost, fetchPosts } from '../../api/posts'
import { useFeedFilter } from '../../store/feedFilter'
import { firstComment, firstPost, secondPost } from '../../test/mockData'
import { createQueryHarness } from '../../test/queryHarness'
import { PostsPage } from '../PostsPage/PostsPage'
import PostDetailsPage from './PostDetailsPage'

vi.mock('../../api/posts')

beforeEach(() => {
  vi.resetAllMocks()
  useFeedFilter.setState({ userId: null, search: '', favoritesOnly: false })
  vi.mocked(fetchIndividualPost).mockResolvedValue(firstPost)
  vi.mocked(fetchComments).mockResolvedValue([firstComment])
})

function renderDetails(path = '/posts/1') {
  const { wrapper: QueryProvider } = createQueryHarness()
  render(
    <QueryProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<PostsPage />} />
          <Route path="/posts/:postId" element={<PostDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryProvider>,
  )
}

it('should show loading feedback followed by the post and its comments', async () => {
  renderDetails()
  expect(screen.getByRole('status', { name: 'Loading post' })).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Back to posts' }).getAttribute('href'),
  ).toBe('/')
  expect(screen.getByRole('region', { name: 'Comments' })).toBeTruthy()
  expect(screen.getByRole('status', { name: 'Loading comments' })).toBeTruthy()
  expect(
    await screen.findByRole('heading', { name: firstPost.title }),
  ).toBeTruthy()
  expect(await screen.findByText(firstComment.email)).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Back to posts' }).getAttribute('href'),
  ).toBe('/')
})

it.each([0, -2, 1.5])(
  'should request the post for numeric ID %s',
  async (id) => {
    renderDetails(`/posts/${id}`)

    await screen.findByRole('heading', { name: firstPost.title })
    expect(fetchIndividualPost).toHaveBeenCalledWith(
      id,
      expect.any(AbortSignal),
    )
    expect(fetchComments).toHaveBeenCalledWith({
      postId: id,
      signal: expect.any(AbortSignal),
    })
  },
)

it('should show a not-found view for invalid IDs without calling the API', () => {
  renderDetails('/posts/invalid')
  expect(screen.getByRole('heading', { name: 'Post not found' })).toBeTruthy()
  expect(fetchIndividualPost).not.toHaveBeenCalled()
})

it('should show a not-found view when the post API returns a 404', async () => {
  vi.mocked(fetchIndividualPost).mockRejectedValue({
    isAxiosError: true,
    response: { status: 404 },
  })
  renderDetails()
  expect(
    await screen.findByRole('heading', { name: 'Post not found' }),
  ).toBeTruthy()
})

it('should retry a failed post request', async () => {
  const user = userEvent.setup()
  vi.mocked(fetchIndividualPost).mockRejectedValueOnce(new Error('Offline'))
  renderDetails()
  expect(await screen.findByText('We couldn’t load this post.')).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Back to posts' }).getAttribute('href'),
  ).toBe('/')
  await user.click(screen.getByRole('button', { name: 'Try again' }))
  expect(
    await screen.findByRole('heading', { name: firstPost.title }),
  ).toBeTruthy()
})

it('should retry failed comments while keeping the post visible', async () => {
  const user = userEvent.setup()
  vi.mocked(fetchComments)
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValue([])
  renderDetails()
  expect(await screen.findByText('We couldn’t load comments.')).toBeTruthy()
  expect(screen.getByRole('heading', { name: firstPost.title })).toBeTruthy()
  await user.click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByText('No comments yet.')).toBeTruthy()
})

it('should show the post while comments are still loading', async () => {
  vi.mocked(fetchComments).mockImplementation(() => new Promise(() => {}))
  renderDetails()
  expect(
    await screen.findByRole('heading', { name: firstPost.title }),
  ).toBeTruthy()
  expect(screen.getByRole('status', { name: 'Loading comments' })).toBeTruthy()
})

it('should open the feed filtered to the post author and allow clearing the filter', async () => {
  const user = userEvent.setup()
  vi.mocked(fetchPosts).mockResolvedValue([
    firstPost,
    { ...secondPost, userId: 2 },
  ])
  useFeedFilter.setState({ search: 'unrelated', favoritesOnly: true })
  renderDetails()

  await user.click(
    await screen.findByRole('button', { name: 'More posts by this user' }),
  )
  expect(
    await screen.findByRole('link', { name: firstPost.title }),
  ).toBeTruthy()
  expect(screen.queryByRole('link', { name: secondPost.title })).toBeNull()
  await user.click(
    screen.getByRole('button', { name: 'Filter by user: User 1' }),
  )
  await user.click(screen.getByRole('button', { name: 'All users' }))
  expect(screen.getByRole('link', { name: secondPost.title })).toBeTruthy()
})

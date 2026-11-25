import { beforeEach, expect, it, jest } from '@jest/globals'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { PostsPage } from './PostsPage'
import { fetchComments, fetchPosts } from '../../api/posts'
import { firstComment, firstPost, secondPost } from '../../test/mockData'
import { createQueryHarness } from '../../test/queryHarness'

jest.mock('../../api/posts', () => ({
  fetchComments: jest.fn(),
  fetchPosts: jest.fn(),
}))

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(fetchPosts).mockResolvedValue([firstPost, secondPost])
  jest.mocked(fetchComments).mockResolvedValue([firstComment])
})

it('should show a loading state and then display each post with its comment count', async () => {
  renderFeed()

  expect(screen.getByRole('heading', { level: 1, name: 'Posts' })).toBeTruthy()
  expect(screen.getByRole('status', { name: 'Loading posts' })).toBeTruthy()

  const [firstCard, secondCard] = await screen.findAllByRole('article')
  expect(
    within(firstCard).getByRole('heading', { name: firstPost.title }),
  ).toBeTruthy()
  expect(within(firstCard).getByText(firstPost.body)).toBeTruthy()
  expect(await within(firstCard).findByText('1 comment')).toBeTruthy()
  expect(within(secondCard).getByText('0 comments')).toBeTruthy()
})

it('should retry a failed posts request and show an empty feed', async () => {
  const user = userEvent.setup()
  jest
    .mocked(fetchPosts)
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValue([])

  renderFeed()
  expect(await screen.findByText('We couldn’t load the posts.')).toBeTruthy()
  await user.click(screen.getByRole('button', { name: 'Try again' }))

  expect(await screen.findByText('No posts to display.')).toBeTruthy()
})

it('should keep posts visible and retry when comments fail', async () => {
  const user = userEvent.setup()
  jest.mocked(fetchComments).mockRejectedValueOnce(new Error('Offline'))

  renderFeed()
  expect(await screen.findByText('We couldn’t load comments.')).toBeTruthy()
  expect(screen.getByRole('heading', { name: firstPost.title })).toBeTruthy()
  expect(screen.queryByText('0 comments')).toBeNull()

  await user.click(screen.getByRole('button', { name: 'Try again' }))

  expect(await screen.findByText('1 comment')).toBeTruthy()
})

function renderFeed() {
  const { wrapper } = createQueryHarness()
  render(
    <MemoryRouter>
      <PostsPage />
    </MemoryRouter>,
    { wrapper },
  )
}

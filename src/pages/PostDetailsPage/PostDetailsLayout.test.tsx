import { expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PostDetailsLayout } from './PostDetailsLayout'

it('should render its children and allow returning to the feed while loading', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={['/posts/1']}>
      <Routes>
        <Route path="/" element={<h1>Posts</h1>} />
        <Route
          path="/posts/:postId"
          element={
            <PostDetailsLayout>
              <p role="status">Loading post</p>
            </PostDetailsLayout>
          }
        />
      </Routes>
    </MemoryRouter>,
  )

  expect(screen.getByRole('status').textContent).toBe('Loading post')

  await user.click(screen.getByRole('link', { name: 'Back to posts' }))

  expect(screen.getByRole('heading', { name: 'Posts' })).toBeTruthy()
})

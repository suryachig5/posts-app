import { expect, it, jest } from '@jest/globals'
import { render, screen, within } from '@testing-library/react'
import { App } from './App'

jest.mock('./pages/PostsPage/PostsPage', () => ({
  PostsPage: () => <h1>Posts</h1>,
}))

it('should render the posts page inside the main landmark', () => {
  render(<App />)

  expect(
    within(screen.getByRole('main')).getByRole('heading', { name: 'Posts' }),
  ).toBeTruthy()
})

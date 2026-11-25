import { expect, it } from '@jest/globals'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { firstPost } from '../../test/mockData'
import { PostCard } from './PostCard'

it('should show the post title, body, and comment count in the card', () => {
  render(
    <PostCard post={firstPost} commentCount={3} commentsFailed={false} />,
    { wrapper: MemoryRouter },
  )

  const card = within(screen.getByRole('article'))
  expect(card.getByRole('heading', { name: firstPost.title })).toBeTruthy()
  expect(
    card.getByRole('link', { name: firstPost.title }).getAttribute('href'),
  ).toBe('/posts/1')
  expect(card.getByText(firstPost.body)).toBeTruthy()
  expect(card.getByText('3 comments')).toBeTruthy()
})

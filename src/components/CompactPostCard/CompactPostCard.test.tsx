import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it } from 'vitest'

import { firstPost } from '../../test/mockData'
import { CompactPostCard } from './CompactPostCard'

it('should show the post link, comment count, and favorite button in the preview', () => {
  render(<CompactPostCard post={firstPost} commentCount={0} />, {
    wrapper: MemoryRouter,
  })

  expect(
    screen.getByRole('link', { name: firstPost.title }).getAttribute('href'),
  ).toBe('/posts/1')
  expect(screen.queryByText(firstPost.body)).toBeNull()
  expect(screen.getByText('0 comments')).toBeTruthy()
  expect(
    screen.getByRole('button', { name: 'Favorite: First post' }),
  ).toBeTruthy()
})

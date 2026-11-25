import { expect, it } from '@jest/globals'
import { render } from '@testing-library/react'
import { PostCardSkeleton } from './PostCardSkeleton'

it('should render a decorative card placeholder hidden from assistive technology', () => {
  const { container } = render(<PostCardSkeleton />)

  expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
})

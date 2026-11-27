import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import { ErrorBoundary } from './ErrorBoundary'

it('should show a reload action after a render error and recover when remounted', () => {
  const onCaughtError = vi.fn()
  const { rerender } = render(
    <ErrorBoundary key="broken">
      <BrokenContent />
    </ErrorBoundary>,
    { onCaughtError },
  )

  expect(screen.getByRole('alert').textContent).toContain(
    'Something went wrong',
  )
  expect(screen.getByRole('button', { name: 'Reload page' })).toBeTruthy()
  expect(onCaughtError).toHaveBeenCalled()

  rerender(
    <ErrorBoundary key="next-route">
      <h1>Posts</h1>
    </ErrorBoundary>,
  )

  expect(screen.getByRole('heading', { name: 'Posts' })).toBeTruthy()
  expect(screen.queryByRole('alert')).toBeNull()
})

function BrokenContent(): never {
  throw new Error('Test render failure')
}

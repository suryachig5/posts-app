import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

import { RetryNotice } from './RetryNotice'

it('should allow retrying an error and disable the button while retrying', async () => {
  const user = userEvent.setup()
  const retry = vi.fn()
  const { rerender } = render(
    <RetryNotice message="Request failed" retry={retry} retrying={false} />,
  )
  expect(screen.getByRole('status').textContent).toBe('Request failed')
  await user.click(screen.getByRole('button', { name: 'Try again' }))
  expect(retry).toHaveBeenCalledTimes(1)
  rerender(<RetryNotice message="Request failed" retry={retry} retrying />)
  const button = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Retrying…',
  })
  expect(button.disabled).toBe(true)
})

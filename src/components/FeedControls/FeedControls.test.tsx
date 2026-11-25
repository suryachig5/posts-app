import { expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeedControls } from './FeedControls'

it('should forward search input and reflect the sticky toolbar state', async () => {
  const user = userEvent.setup()
  const onSearch = jest.fn()
  render(
    <FeedControls showCompactTitle pinned search="apple" onSearch={onSearch} />,
  )

  const toolbar = screen.getByRole('search').parentElement
  expect(toolbar?.dataset.pinned).toBe('true')
  expect(toolbar?.dataset.compactTitle).toBe('true')

  await user.click(screen.getByRole('button', { name: 'Clear search' }))
  expect(onSearch).toHaveBeenCalledWith('')
})

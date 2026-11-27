import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

import { FilterButton } from './FilterButton'

it('should render the label and decorative icon and reflect the selected state', () => {
  const props = {
    text: 'Favorites',
    icon: <span>Heart</span>,
    onClick: vi.fn(),
  }
  const { rerender } = render(<FilterButton {...props} selected={false} />)

  const button = screen.getByRole('button', {
    name: 'Favorites',
    pressed: false,
  })
  expect(
    within(button).getByText('Heart').closest('[aria-hidden="true"]'),
  ).not.toBeNull()

  rerender(<FilterButton {...props} selected />)

  expect(screen.getByRole('button', { name: 'Favorites', pressed: true })).toBe(
    button,
  )
})

it('should invoke the click handler when activated', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <FilterButton
      text="Favorites"
      icon={<span>Heart</span>}
      selected={false}
      onClick={onClick}
    />,
  )

  await user.click(screen.getByRole('button', { name: 'Favorites' }))

  expect(onClick).toHaveBeenCalledTimes(1)
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

import { Dropdown } from './Dropdown'

it('should open, select an option, and return focus using the keyboard', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  render(
    <Dropdown
      label="Filter"
      value="one"
      options={[
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' },
      ]}
      onChange={onChange}
    />,
  )

  const trigger = screen.getByRole('button', { name: 'Filter: One' })
  await user.tab()
  await user.keyboard('{Enter}')
  expect(
    screen.getByRole('button', { name: 'One', pressed: true }),
  ).toBeTruthy()

  await user.tab()
  await user.tab()
  await user.keyboard('{Enter}')
  expect(onChange).toHaveBeenCalledWith('two')
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(trigger)
})

it('should close on Escape or an outside click', async () => {
  const user = userEvent.setup()
  render(
    <>
      <Dropdown
        label="Filter"
        value="one"
        options={[{ label: 'One', value: 'one' }]}
        onChange={vi.fn()}
      />
      <button type="button">Outside</button>
    </>,
  )

  const trigger = screen.getByRole('button', { name: 'Filter: One' })
  await user.click(trigger)
  await user.tab()
  await user.keyboard('{Escape}')
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(trigger)

  await user.click(trigger)
  await user.click(screen.getByRole('button', { name: 'Outside' }))
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
})

it('should display the filter label when the selected value is unavailable', () => {
  render(
    <Dropdown
      label="Filter"
      value="removed"
      options={[{ label: 'One', value: 'one' }]}
      onChange={vi.fn()}
    />,
  )

  const trigger = screen.getByRole('button', { name: 'Filter' })
  expect(trigger.textContent).toBe('Filter')
})

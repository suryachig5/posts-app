import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'

import { FeedControls } from './FeedControls'

it('should forward search, clear, and filter changes from the feed controls', async () => {
  const user = userEvent.setup()
  const onChangeUser = vi.fn()
  const onSearch = vi.fn()
  const onChangeFilter = vi.fn()
  render(
    <FeedControls
      showCompactTitle
      pinned
      userIds={[1, 2]}
      userId={null}
      onChangeUser={onChangeUser}
      search="apple"
      favoritesOnly={false}
      onSearch={onSearch}
      onChangeFilter={onChangeFilter}
    />,
  )
  await user.click(
    screen.getByRole('button', { name: 'Filter by user: All users' }),
  )
  await user.click(screen.getByRole('button', { name: 'User 2' }))
  expect(onChangeUser).toHaveBeenLastCalledWith(2)
  fireEvent.change(screen.getByRole('searchbox'), {
    target: { value: 'orange' },
  })
  expect(onSearch).toHaveBeenLastCalledWith('orange')
  await user.click(screen.getByRole('button', { name: 'Clear search' }))
  expect(onSearch).toHaveBeenLastCalledWith('')
  await user.click(screen.getByRole('button', { name: 'Favorites' }))
  expect(onChangeFilter).toHaveBeenLastCalledWith(true)
  await user.click(
    screen.getByRole('button', { name: 'All posts', pressed: true }),
  )
  expect(onChangeFilter).toHaveBeenLastCalledWith(false)
})

it.each([
  [false, null, 'Search posts…'],
  [true, null, 'Search favorite posts…'],
  [false, 2, 'Search posts by User 2…'],
  [true, 2, 'Search favorite posts by User 2…'],
])(
  'should show the search scope for Favorites %s and user %s',
  (favoritesOnly, userId, placeholder) => {
    render(
      <FeedControls
        showCompactTitle={false}
        pinned={false}
        userIds={[2]}
        userId={userId}
        onChangeUser={vi.fn()}
        search=""
        favoritesOnly={favoritesOnly}
        onSearch={vi.fn()}
        onChangeFilter={vi.fn()}
      />,
    )

    expect(screen.getByRole('searchbox').getAttribute('placeholder')).toBe(
      placeholder,
    )
  },
)

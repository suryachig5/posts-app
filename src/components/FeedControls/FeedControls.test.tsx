import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, jest } from '@jest/globals'
import { FeedControls } from './FeedControls'

it('should forward search, clear, and filter changes from the feed controls', async () => {
  const user = userEvent.setup()
  const onSearch = jest.fn()
  const onChangeFilter = jest.fn()
  render(
    <FeedControls
      showCompactTitle
      pinned
      search="apple"
      favoritesOnly={false}
      onSearch={onSearch}
      onChangeFilter={onChangeFilter}
    />,
  )
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

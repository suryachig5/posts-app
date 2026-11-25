import { expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchField } from './SearchField'

it('should render the labeled searchbox and forward typed input', async () => {
  const user = userEvent.setup()
  const onChange = jest.fn()
  render(
    <SearchField
      label="Search posts"
      placeholder="Search posts…"
      value="post"
      onChange={onChange}
    />,
  )

  const input = screen.getByRole<HTMLInputElement>('searchbox', {
    name: 'Search posts',
  })
  expect(input.value).toBe('post')
  expect(input.placeholder).toBe('Search posts…')

  await user.type(input, 's')

  expect(onChange).toHaveBeenCalledWith('posts')
})

it('should request an empty value when cleared and hide the clear button for an empty value', async () => {
  const user = userEvent.setup()
  const onChange = jest.fn()
  const { rerender } = render(
    <SearchField label="Search posts" value="post" onChange={onChange} />,
  )

  await user.click(screen.getByRole('button', { name: 'Clear search' }))

  expect(onChange).toHaveBeenCalledWith('')

  rerender(<SearchField label="Search posts" value="" onChange={onChange} />)

  expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull()
})

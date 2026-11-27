import { afterEach, expect, it } from 'vitest'

import { useFeedFilter } from './feedFilter'

afterEach(() => useFeedFilter.setState({ search: '' }))

it('should store and clear the search term', () => {
  const { setSearch } = useFeedFilter.getState()

  setSearch('apple')
  expect(useFeedFilter.getState().search).toBe('apple')

  setSearch('')
  expect(useFeedFilter.getState().search).toBe('')
})

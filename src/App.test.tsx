import { expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { App } from './App'

it('should render the Posts App heading', () => {
  render(<App />)

  expect(
    screen.getByRole('heading', { level: 1, name: 'Posts App' }),
  ).toBeTruthy()
})

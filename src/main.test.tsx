import { expect, it, jest } from '@jest/globals'
import { createRoot } from 'react-dom/client'

jest.mock('react-dom/client', () => ({ createRoot: jest.fn() }))

it('should mount the application in the root element', async () => {
  const element = document.createElement('div')
  element.id = 'root'
  document.body.append(element)
  const render = jest.fn()
  jest.mocked(createRoot).mockReturnValue({ render, unmount: jest.fn() })

  try {
    await import('./main')

    expect(jest.mocked(createRoot).mock.calls[0]?.[0] === element).toBe(true)
    expect(render).toHaveBeenCalledTimes(1)
  } finally {
    element.remove()
  }
})

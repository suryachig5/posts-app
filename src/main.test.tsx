import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'

vi.mock('react-dom/client', () => ({ createRoot: vi.fn() }))

it('should mount the application in the root element', async () => {
  const element = document.createElement('div')
  element.id = 'root'
  document.body.append(element)
  const render = vi.fn()
  vi.mocked(createRoot).mockReturnValue({ render, unmount: vi.fn() })

  try {
    await import('./main')

    expect(vi.mocked(createRoot).mock.calls[0]?.[0] === element).toBe(true)
    expect(render).toHaveBeenCalledTimes(1)
  } finally {
    element.remove()
  }
})

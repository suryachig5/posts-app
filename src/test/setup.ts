import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Use jsdom storage so each test environment has its own favorites.
vi.stubGlobal('localStorage', jsdom.window.localStorage)

Object.assign(globalThis, {
  IntersectionObserver: class {
    observe() {}
    disconnect() {}
  },
  scrollTo: vi.fn(),
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

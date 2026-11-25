import { TextDecoder, TextEncoder } from 'node:util'
import { cleanup } from '@testing-library/react'
import { afterEach, jest } from '@jest/globals'

Object.assign(globalThis, {
  TextDecoder,
  TextEncoder,
  IntersectionObserver: class {
    observe() {}
    disconnect() {}
  },
  scrollTo: jest.fn(),
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

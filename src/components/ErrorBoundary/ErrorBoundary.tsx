import type { PropsWithChildren } from 'react'
import { Component } from 'react'

interface ErrorBoundaryState {
  failed: boolean
}

/** Offers a reload if rendering or loading a route fails unexpectedly. */
export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  render() {
    return this.state.failed ? (
      <section role="alert">
        <h1>Something went wrong</h1>
        <p>Reload the page to try again.</p>
        <button type="button" onClick={reloadPage}>
          Reload page
        </button>
      </section>
    ) : (
      this.props.children
    )
  }
}

function reloadPage() {
  window.location.reload()
}

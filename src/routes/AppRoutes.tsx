import { lazy, Suspense, useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'

import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary'
import { PostDetailsSkeleton } from '../components/LoadingSkeletons/PostDetailsSkeleton'
import { PostDetailsLayout } from '../pages/PostDetailsPage/PostDetailsLayout'
import { PostsPage } from '../pages/PostsPage/PostsPage'

import sharedStyles from '../styles/shared.module.scss'
import styles from './AppRoutes.module.scss'

const PostDetailsPage = lazy(
  () => import('../pages/PostDetailsPage/PostDetailsPage'),
)

/** Renders the active route and resets scroll and focus when the path changes. */
export function AppRoutes() {
  const { pathname } = useLocation()

  useEffect(focusMainContent, [pathname])

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <main id="main-content" tabIndex={-1} className={styles.main}>
        <ErrorBoundary key={pathname}>
          <Routes>
            <Route path="/" element={<PostsPage />} />
            <Route path="/posts/:postId" element={<PostDetailsRoute />} />
            <Route path="*" element={<NotFoundRoute />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </>
  )
}

function PostDetailsRoute() {
  return (
    <Suspense fallback={<PostDetailsFallback />}>
      <PostDetailsPage />
    </Suspense>
  )
}

function PostDetailsFallback() {
  return (
    <PostDetailsLayout>
      <PostDetailsSkeleton />
    </PostDetailsLayout>
  )
}

function NotFoundRoute() {
  return (
    <>
      <h1>Page not found</h1>
      <Link className={sharedStyles.backLink} to="/">
        Back to posts
      </Link>
    </>
  )
}

function focusMainContent() {
  window.scrollTo(0, 0)
  document.getElementById('main-content')?.focus({ preventScroll: true })
}

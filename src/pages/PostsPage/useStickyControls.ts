import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Tracks the sticky toolbar and keeps changed results in view. */
export function useStickyControls(
  search: string,
  favoritesOnly: boolean,
  userId: number | null,
) {
  const controlsRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const controlsMarkerRef = useRef<HTMLDivElement>(null)
  const [showCompactTitle, setShowCompactTitle] = useState(false)
  const [controlsPinned, setControlsPinned] = useState(false)

  useEffect(() => {
    const heading = headingRef.current
    const marker = controlsMarkerRef.current
    if (!heading || !marker) return

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const aboveViewport =
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0
        if (entry.target === heading) setShowCompactTitle(aboveViewport)
        else setControlsPinned(aboveViewport)
      }
    })
    observer.observe(heading)
    observer.observe(marker)
    return () => observer.disconnect()
  }, [])

  const previousFilters = useRef({ search, favoritesOnly, userId })
  useLayoutEffect(() => {
    const previous = previousFilters.current
    previousFilters.current = { search, favoritesOnly, userId }
    if (
      previous.search === search &&
      previous.favoritesOnly === favoritesOnly &&
      previous.userId === userId
    )
      return

    const controls = controlsRef.current
    const results = resultsRef.current
    if (!controls || !results) return

    const offset = results.getBoundingClientRect().top - controls.offsetHeight
    if (offset < -1) {
      window.scrollTo({ top: window.scrollY + offset, behavior: 'instant' })
    }
  }, [search, favoritesOnly, userId])
  return {
    controlsRef,
    resultsRef,
    headingRef,
    controlsMarkerRef,
    showCompactTitle,
    controlsPinned,
  }
}

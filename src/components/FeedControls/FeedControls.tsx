import styles from './FeedControls.module.scss'
import { SearchField } from '../SearchField/SearchField'

interface FeedControlsProps {
  showCompactTitle: boolean
  pinned: boolean
  search: string
  onSearch: (value: string) => void
}

/** Renders the sticky search field. */
export function FeedControls({
  showCompactTitle,
  pinned,
  search,
  onSearch,
}: FeedControlsProps) {
  return (
    <div
      className={styles.controls}
      data-compact-title={showCompactTitle}
      data-pinned={pinned}
    >
      <span className={styles.title} aria-hidden="true">
        Posts
      </span>
      <SearchField
        label="Search posts"
        placeholder="Search posts…"
        value={search}
        onChange={onSearch}
      />
    </div>
  )
}

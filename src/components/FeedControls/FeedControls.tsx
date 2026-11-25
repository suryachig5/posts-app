import styles from './FeedControls.module.scss'
import { Heart, LayoutList } from 'lucide-react'
import { FilterButton } from '../FilterButton/FilterButton'
import { SearchField } from '../SearchField/SearchField'

interface FeedControlsProps {
  showCompactTitle: boolean
  pinned: boolean
  search: string
  favoritesOnly: boolean
  onSearch: (value: string) => void
  onChangeFilter: (favoritesOnly: boolean) => void
}

/** Renders the sticky search field and Favorites filter. */
export function FeedControls({
  showCompactTitle,
  pinned,
  search,
  favoritesOnly,
  onSearch,
  onChangeFilter,
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
      <div
        className={styles.filters}
        data-favorites-only={favoritesOnly}
        role="group"
        aria-label="Filter posts"
      >
        <FilterButton
          icon={<LayoutList size={16} />}
          text="All posts"
          selected={!favoritesOnly}
          onClick={showAllPosts}
        />
        <FilterButton
          icon={<Heart size={16} />}
          text="Favorites"
          selected={favoritesOnly}
          onClick={showFavorites}
        />
      </div>
    </div>
  )

  function showAllPosts() {
    onChangeFilter(false)
  }

  function showFavorites() {
    onChangeFilter(true)
  }
}

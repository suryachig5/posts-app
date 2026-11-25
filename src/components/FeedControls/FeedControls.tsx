import styles from './FeedControls.module.scss'
import type { Ref } from 'react'
import { Heart, LayoutList } from 'lucide-react'
import { Dropdown } from '../Dropdown/Dropdown'
import { FilterButton } from '../FilterButton/FilterButton'
import { SearchField } from '../SearchField/SearchField'

interface FeedControlsProps {
  controlsRef?: Ref<HTMLDivElement>
  showCompactTitle: boolean
  pinned: boolean
  userIds: number[]
  userId: number | null
  onChangeUser: (userId: number | null) => void
  search: string
  favoritesOnly: boolean
  onSearch: (value: string) => void
  onChangeFilter: (favoritesOnly: boolean) => void
}

/** Renders the sticky search field, user, favorites filters. */
export function FeedControls({
  controlsRef,
  showCompactTitle,
  pinned,
  userIds,
  userId,
  onChangeUser,
  search,
  favoritesOnly,
  onSearch,
  onChangeFilter,
}: FeedControlsProps) {
  const userOptions = [
    { value: '', label: 'All users' },
    ...userIds.map((id) => ({ value: String(id), label: `User ${id}` })),
  ]

  return (
    <div
      ref={controlsRef}
      className={styles.controls}
      data-compact-title={showCompactTitle}
      data-pinned={pinned}
    >
      <span className={styles.title} aria-hidden="true">
        Posts
      </span>
      <SearchField
        label="Search posts"
        placeholder={getSearchPlaceholder(favoritesOnly, userId)}
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
      <div className={styles.userFilter}>
        <Dropdown
          label="Filter by user"
          value={userId === null ? '' : String(userId)}
          options={userOptions}
          onChange={changeUser}
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

  function changeUser(value: string) {
    onChangeUser(value === '' ? null : Number(value))
  }
}

function getSearchPlaceholder(favoritesOnly: boolean, userId: number | null) {
  if (userId === null) {
    return favoritesOnly ? 'Search favorite posts…' : 'Search posts…'
  }

  return favoritesOnly
    ? `Search favorite posts by User ${userId}…`
    : `Search posts by User ${userId}…`
}

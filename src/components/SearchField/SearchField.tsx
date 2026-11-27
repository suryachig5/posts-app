import { Search, X } from 'lucide-react'
import type { ChangeEvent } from 'react'

import styles from './SearchField.module.scss'

interface SearchFieldProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

/** Renders a controlled search field with a clear action. */
export function SearchField(props: SearchFieldProps) {
  const { label, placeholder, value, onChange } = props

  return (
    <div className={styles.search} role="search">
      <Search size={19} aria-hidden />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button type="button" aria-label="Clear search" onClick={clearSearch}>
          <X size={18} aria-hidden />
        </button>
      )}
    </div>
  )

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  function clearSearch() {
    onChange('')
  }
}

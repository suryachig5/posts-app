import classNames from 'classnames'
import type { ReactNode } from 'react'
import styles from './FilterButton.module.scss'

interface FilterButtonProps {
  icon: ReactNode
  text: string
  selected: boolean
  onClick: () => void
}

/** Renders an icon and text with a selected state. */
export function FilterButton(props: FilterButtonProps) {
  const { icon, text, selected, onClick } = props

  return (
    <button
      type="button"
      className={classNames(styles.button, { [styles.selected]: selected })}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      {text}
    </button>
  )
}

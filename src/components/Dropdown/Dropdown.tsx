import { Check, ChevronDown } from 'lucide-react'
import type { FocusEvent, KeyboardEvent } from 'react'
import { useEffect, useId, useRef, useState } from 'react'

import styles from './Dropdown.module.scss'

interface DropdownProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

/** Displays an inline picker for a single value. */
export function Dropdown(props: DropdownProps) {
  const { label, value, options, onChange } = props
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const optionsId = useId()
  const selectedLabel = options.find((option) => option.value === value)?.label
  useEffect(watchOutsideClicks, [open])

  return (
    <div className={styles.dropdown} ref={root} onBlur={handleBlur}>
      <button
        type="button"
        className={styles.trigger}
        ref={trigger}
        aria-label={selectedLabel ? `${label}: ${selectedLabel}` : label}
        aria-expanded={open}
        aria-controls={open ? optionsId : undefined}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        {selectedLabel ?? label}
        <ChevronDown size={16} aria-hidden />
      </button>
      {open && (
        <ul className={styles.options} id={optionsId}>
          {options.map(renderOption)}
        </ul>
      )}
    </div>
  )

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!open || event.key !== 'Escape') return
    event.preventDefault()
    closeAndFocusTrigger()
  }

  function toggle() {
    setOpen((previous) => !previous)
  }

  function renderOption(option: DropdownProps['options'][number]) {
    const selected = option.value === value

    return (
      <li key={option.value}>
        <button
          type="button"
          className={styles.option}
          aria-pressed={selected}
          onClick={selectOption}
          onKeyDown={handleKeyDown}
        >
          {option.label}
          {selected && <Check size={16} aria-hidden />}
        </button>
      </li>
    )

    function selectOption() {
      onChange(option.value)
      closeAndFocusTrigger()
    }
  }

  function closeAndFocusTrigger() {
    setOpen(false)
    trigger.current?.focus()
  }

  function watchOutsideClicks() {
    if (!open) return
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsideClick)

    function closeOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !root.current?.contains(event.target)
      ) {
        setOpen(false)
      }
    }
  }
}

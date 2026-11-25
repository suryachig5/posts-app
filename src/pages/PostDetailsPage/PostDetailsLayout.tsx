import styles from './PostDetailsLayout.module.scss'
import sharedStyles from '../../styles/shared.module.scss'
import type { PropsWithChildren } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Keeps the detail layout and back navigation available while loading. */
export function PostDetailsLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.page}>
      <Link className={sharedStyles.backLink} to="/">
        <ArrowLeft size={18} aria-hidden /> Back to posts
      </Link>
      {children}
    </div>
  )
}

import { PostsPage } from './pages/PostsPage/PostsPage'
import styles from './App.module.scss'

/** Renders the application shell. */
export function App() {
  return (
    <main className={styles.main}>
      <PostsPage />
    </main>
  )
}

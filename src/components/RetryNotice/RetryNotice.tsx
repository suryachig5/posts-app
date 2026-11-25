import classNames from 'classnames'
import sharedStyles from '../../styles/shared.module.scss'
import styles from './RetryNotice.module.scss'
interface RetryNoticeProps {
  message: string
  retry: () => void
  retrying: boolean
}

/** Displays a request failure with a retry button that is disabled during retry. */
export function RetryNotice({ message, retry, retrying }: RetryNoticeProps) {
  return (
    <div className={classNames(sharedStyles.statusPanel, styles.notice)}>
      <span role="status">{message}</span>{' '}
      <button
        type="button"
        className={classNames(sharedStyles.textButton, styles.button)}
        onClick={handleRetry}
        disabled={retrying}
      >
        {retrying ? 'Retrying…' : 'Try again'}
      </button>
    </div>
  )

  function handleRetry() {
    retry()
  }
}

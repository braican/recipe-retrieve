import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import styles from './ShareTarget.module.css'

/**
 * This page is the Web Share Target handler.
 * When the user shares an Instagram post to the PWA from Android,
 * the system opens /share-target?url=...&title=...&text=...
 *
 * If authenticated, we redirect to /add/instagram with the URL pre-filled.
 * If not authenticated, we store the intent and send them to login.
 */
export default function ShareTarget() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const url   = params.get('url')   || ''
    const text  = params.get('text')  || ''
    const title = params.get('title') || ''

    // Store share payload in sessionStorage so it survives a login redirect
    if (url || text) {
      sessionStorage.setItem('share-payload', JSON.stringify({ url, text, title }))
    }

    if (user) {
      navigate('/add/instagram', { replace: true, state: { url, caption: text } })
    } else {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  return (
    <div className={styles.page}>
      <span className={styles.spinner} />
      <p>Opening Recipe Retrieve…</p>
    </div>
  )
}

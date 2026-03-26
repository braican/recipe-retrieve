import { Outlet, Link, useLocation } from 'react-router'
import { useAuth } from '../lib/auth'
import styles from './Nav.module.css'

export default function Nav() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>Recipe Retrieve</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            Collection
          </Link>
          <Link
            to="/add"
            className={`${styles.navLink} ${isActive('/add') ? styles.active : ''}`}
          >
            + Add
          </Link>
        </nav>

        <div className={styles.userArea}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>
              {(user?.name || user?.email || '?')[0].toUpperCase()}
            </div>
          )}
          <button className={styles.logoutBtn} onClick={logout} title="Sign out">
            ↪
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  )
}

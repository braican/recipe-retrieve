import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { useAuth } from "../lib/auth";
import Logo from "../icons/Logo";
import styles from "./Nav.module.css";

export default function Nav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  function close() {
    setOpen(false);
  }

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo} onClick={close}>
          <Logo height={28} />
          <span className={styles.logoText}>Recipe Retrieve</span>
        </Link>

        <div className={styles.headerActions}>
          {/* Desktop nav */}
          <nav className={styles.desktopNav}>
            <Link
              to="/menu"
              className={`${styles.navLink} ${isActive("/menu") ? styles.navLinkActive : ""}`}
            >
              This Week's Menu
            </Link>
            <Link to="/add" className={styles.addBtn}>
              + Add
            </Link>
          </nav>
          <div className={styles.desktopUser}>
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {(user?.name || user?.email || "?")[0].toUpperCase()}
              </div>
            )}
            <button
              className={styles.logoutBtn}
              onClick={logout}
              title="Sign out"
            >
              ↪
            </button>
          </div>

          {/* Mobile controls */}
          <Link to="/add" className={styles.mobileAddBtn} onClick={close}>
            + Add
          </Link>
          <button
            className={styles.menuBtn}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`${styles.menuIcon} ${open ? styles.menuIconOpen : ""}`}
            />
          </button>
        </div>
      </header>

      {open && <div className={styles.overlay} onClick={close} />}

      <nav className={`${styles.flyout} ${open ? styles.flyoutOpen : ""}`}>
        <Link
          to="/menu"
          className={`${styles.flyoutLink} ${isActive("/menu") ? styles.flyoutLinkActive : ""}`}
          onClick={close}
        >
          This Week's Menu
        </Link>

        <div className={styles.flyoutUser}>
          <div className={styles.userInfo}>
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {(user?.name || user?.email || "?")[0].toUpperCase()}
              </div>
            )}
            <span className={styles.userName}>{user?.name || user?.email}</span>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={() => {
              logout();
              close();
            }}
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

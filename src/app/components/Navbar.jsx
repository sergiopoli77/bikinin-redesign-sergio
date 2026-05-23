"use client";

import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [wishlistActive, setWishlistActive] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        {/* Brand */}
        <a href="/" className={styles.brand} aria-label="Bikin.in home">
          <span className={styles.brandBikin}>BIKIN</span>
          <span className={styles.brandDot}>.</span>
          <span className={styles.brandIn}>IN</span>
        </a>

        {/* Nav Links */}
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLink}>
            Explore Artwork
          </a>
          <div className={styles.dropdown}>
            <button className={styles.navLink}>
              Other <span className={styles.chevron}>▾</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.navActions}>
          {/* Search */}
          <div className={`${styles.searchBox} ${searchFocused ? styles.searchFocused : ""}`}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              aria-label="Search artworks"
              id="navbar-search"
            />
            <kbd className={styles.searchKbd}>Ctrl+K</kbd>
          </div>

          {/* Cart */}
          <button className={styles.iconBtn} aria-label="Shopping cart" id="navbar-cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className={styles.badge}>0</span>
          </button>

          {/* Notifications */}
          <button className={styles.iconBtn} aria-label="Notifications" id="navbar-notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* Avatar */}
          <div className={styles.avatar} id="navbar-avatar">
            <span>S</span>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Sergio Yosep Poli</span>
            <span className={styles.userRole}>User</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

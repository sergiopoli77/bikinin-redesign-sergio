"use client";

import styles from "./ArtworkDetail.module.css";

export default function ArtworkHeader({ artwork, isSaved, onToggleSave, className = "" }) {
  if (!artwork) return null;

  return (
    <div className={className}>
      {/* ── Status badge ── */}
      <div className={styles.topRow}>
        <span className={styles.soldBadge}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Terjual 0 Produk
        </span>
      </div>

      {/* ── Title ── */}
      <h1 className={styles.title}>{artwork.title}</h1>

      {/* ── Stats ── */}
      <div className={styles.statsRow}>
        <span className={styles.stat}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          {artwork.shows} shows
        </span>
        <span className={styles.statDot}>·</span>
        <span className={styles.stat}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          {artwork.views} views
        </span>
        <button
          className={`${styles.wishBtn} ${isSaved ? styles.wishBtnActive : ""}`}
          onClick={onToggleSave}
          title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label="Save to Wishlist"
        >
          <svg viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {artwork.wishlist + (isSaved ? 1 : 0)} saves
        </button>
      </div>
    </div>
  );
}

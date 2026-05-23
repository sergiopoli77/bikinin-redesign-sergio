"use client";

import { useState } from "react";
import styles from "./ScaleSimulationModal.module.css";

export default function ScaleSimulationModal({ isOpen, onClose }) {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Simulation</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.subtitle}>
            This simulation helps you evaluate if your preferred display scale is visually appropriate for this artwork.
          </p>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label>Width</label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  placeholder="Type here"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
                <span className={styles.unit}>Cm</span>
              </div>
            </div>

            <div className={styles.inputField}>
              <label>Height</label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  placeholder="Type here"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <span className={styles.unit}>Cm</span>
              </div>
            </div>
          </div>

          <p className={styles.footerText}>
            Please input width & height to check compatibility.
          </p>
        </div>
      </div>
    </div>
  );
}

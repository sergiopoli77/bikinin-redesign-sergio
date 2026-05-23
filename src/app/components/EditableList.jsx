"use client";

import { useState } from "react";
import styles from "./EditableList.module.css";

const TYPE_CONFIG = {
  file: { icon: "🖼", label: "File / Image", color: "#0ea5e9", bg: "#e0f2fe" },
  text: { icon: "✏️", label: "Text",         color: "#a855f7", bg: "#f3e8ff" },
};

/* Thumbnail kecil per baris */
function ElThumb({ src, fallback }) {
  const [error, setError] = useState(false);
  
  if (!src || error) return <span style={{ fontSize: 14 }}>{fallback}</span>;
  
  return (
    <img
      src={`${src}?v=1`}
      alt=""
      style={{
        width: "100%", 
        height: "100%",
        objectFit: "cover",
        borderRadius: 4,
        display: "block",
      }}
      onError={() => setError(true)}
      draggable={false}
    />
  );
}

/**
 * EditableList — daftar elemen yang bisa diedit di sidebar.
 * Klik elemen untuk highlight di canvas.
 */
export default function EditableList({ elements, selectedId, onSelect }) {
  if (!elements || elements.length === 0) {
    return (
      <div className={styles.empty}>
        <span>🎨</span>
        <p>No editable elements</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <h3 className={styles.listTitle}>
        Editable Elements
        <span className={styles.listCount}>{elements.length}</span>
      </h3>
      <ul className={styles.list} role="listbox" aria-label="Editable elements">
        {elements.map((el, index) => {
          const config = TYPE_CONFIG[el.type] ?? {
            icon: "?", label: el.type, color: "#64748b", bg: "#f1f5f9",
          };
          const isSelected = selectedId === el.id;

          return (
            <li key={el.id}>
              <button
                className={`${styles.listItem} ${isSelected ? styles.listItemSelected : ""}`}
                onClick={() => onSelect(el.id)}
                id={`list-el-${el.id}`}
                role="option"
                aria-selected={isSelected}
                style={isSelected ? { borderColor: config.color, background: config.bg } : {}}
              >
                <span className={styles.indexBadge}>{index + 1}</span>

                {/* Thumbnail gambar elemen */}
                <span
                  className={styles.typeIcon}
                  style={{ background: config.bg, overflow: "hidden", padding: 0 }}
                >
                  <ElThumb src={el.image} fallback={config.icon} />
                </span>

                <div className={styles.elInfo}>
                  <span className={styles.elLabel}>{el.label}</span>
                  <span className={styles.elType} style={{ color: config.color }}>
                    {config.label}
                  </span>
                </div>
                <span className={styles.elPos}>
                  ({el.xAxis.toFixed(0)}, {el.yAxis.toFixed(0)})
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}



"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import styles from "./ArtworkPreview.module.css";

/* ─────────────────────────────────────────
   Sub-component: Layer gambar yang menyusun desain
   ───────────────────────────────────────── */
function EditableElement({ element, isSelected, onSelect }) {
  if (!element.image) return null;

  return (
    <div
      className={`${styles.designLayer} ${isSelected ? styles.selectedLayer : ""}`}
      style={{
        left: `${element.xAxis}%`,
        top: `${element.yAxis}%`,
        width: `${element.size}%`,
      }}
      onClick={(e) => { e.stopPropagation(); onSelect(element.id); }}
      title={`${element.type.toUpperCase()}: ${element.label}`}
      id={`editable-el-${element.id}`}
    >
      <img
        src={`${element.image}?v=1`}
        alt={element.label}
        className={styles.layerImg}
        draggable={false}
      />
      {isSelected && <div className={styles.layerOutline} />}
    </div>
  );
}

/* ─────────────────────────────────────────
   Sub-component: thumbnail strip item
   ───────────────────────────────────────── */
function Thumbnail({ label, imageUrl, isActive, onClick }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      className={`${styles.thumbnail} ${isActive ? styles.thumbnailActive : ""}`}
      onClick={onClick}
      aria-label={`Tampilan: ${label || "Mockup"}`}
    >
      <div className={styles.thumbImgWrap}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className={`${styles.thumbImg} ${loaded ? styles.thumbLoaded : ""}`}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <div className={styles.thumbEmpty}><span>?</span></div>
        )}
      </div>
      {label ? <span className={styles.thumbLabel}>{label}</span> : null}
    </button>
  );
}

/* ─────────────────────────────────────────
   Main component
   ───────────────────────────────────────── */
export default function ArtworkPreview({ artwork, selectedElementId, onSelectElement }) {
  const [activeSide, setActiveSide]           = useState("front");
  const [activeViewIndex, setActiveViewIndex] = useState(-1); // -1 = custom, >= 0 = mockup
  const [showOverlay, setShowOverlay]         = useState(true);
  const [imgLoaded, setImgLoaded]             = useState(false);
  const [imgError, setImgError]               = useState(false);
  const [rotation, setRotation]               = useState(0);  // 0 | 90 | 180 | 270

  // Zoom & Pan states
  const [zoomed, setZoomed]         = useState(false);
  const [panOffset, setPanOffset]   = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart                   = useRef(null);
  const canvasRef                   = useRef(null);

  // Kaca pembesar
  const [magnifier, setMagnifier] = useState({ visible: false, x: 0, y: 0, pctX: 0, pctY: 0 });
  const MAGNIFIER_SIZE = 110;
  const MAGNIFIER_ZOOM = 2.8;

  const selectedEl = selectedElementId ?? null;

  const sheet     = artwork?.design?.sheets?.[0];
  const frontData = sheet?.sides?.front ?? null;
  const backData  = sheet?.sides?.back  ?? null;

  const hasBack       = artwork.sisi !== "1 sisi" && !!(backData?.background || backData?.elements?.length > 0);
  const effectiveSide = hasBack ? activeSide : "front";
  const sideData      = effectiveSide === "front" ? frontData : backData;

  const backgroundUrl   = sideData?.background ?? null;
  const mockupImages    = sideData?.images ?? [];
  // Tampilan Custom: gunakan backgroundUrl (blank template) agar elemen-elemen layer bisa disusun di atasnya
  const customBgUrl     = backgroundUrl;
  const rawDisplayUrl   = activeViewIndex === -1 ? customBgUrl : (mockupImages[activeViewIndex] ?? null);
  const displayImageUrl = rawDisplayUrl ? `${rawDisplayUrl}?v=1` : null;

  // Filter hanya elemen yang bisa diedit
  const editableElements = useMemo(() => {
    const els = sideData?.elements ?? [];
    return els.filter((el) => el.type === "file" || el.type === "text");
  }, [sideData]);

  const selectedElement = editableElements.find((el) => el.id === selectedEl) ?? null;

  const handleSelectEl = useCallback(
    (id) => { if (onSelectElement) onSelectElement(id); },
    [onSelectElement]
  );

  // Reset semua state visual saat ganti tampilan
  const resetView = () => {
    setImgLoaded(false);
    setImgError(false);
    resetZoom();
    setRotation(0);
  };

  const handleViewChange = (idx) => {
    if (idx === activeViewIndex) return;
    setActiveViewIndex(idx);
    resetView();
  };

  const handleSideChange = (side) => {
    if (side === activeSide) return;
    setActiveSide(side);
    setActiveViewIndex(-1);
    resetView();
  };

  // ── Zoom & Pan ──
  const resetZoom = () => {
    setZoomed(false);
    setPanOffset({ x: 0, y: 0 });
    setIsDragging(false);
    dragStart.current = null;
  };

  const handleCanvasClick = (e) => {
    if (isDragging) return;
    if (zoomed) resetZoom();
    else { setZoomed(true); setPanOffset({ x: 0, y: 0 }); }
  };

  const handleMouseDown = (e) => {
    if (!zoomed) return;
    e.preventDefault();
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    // Kaca pembesar — hanya saat tidak zoom
    if (!zoomed && canvasRef.current) {
      const r    = canvasRef.current.getBoundingClientRect();
      const pctX = ((e.clientX - r.left) / r.width) * 100;
      const pctY = ((e.clientY - r.top)  / r.height) * 100;
      setMagnifier({ visible: true, x: e.clientX - r.left, y: e.clientY - r.top, pctX, pctY });
    }
    // Pan saat zoomed
    if (zoomed && dragStart.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setIsDragging(true);
      setPanOffset({ x: dx, y: dy });
    }
  };

  const handleMouseLeave = () => {
    setMagnifier((m) => ({ ...m, visible: false }));
    if (isDragging) { setIsDragging(false); dragStart.current = null; }
  };

  const handleMouseUp = () => {
    if (dragStart.current) dragStart.current = null;
    setTimeout(() => setIsDragging(false), 0);
  };

  // ── Rotasi ──
  const rotateLeft  = (e) => { e.stopPropagation(); setRotation((r) => (r - 90 + 360) % 360); };
  const rotateRight = (e) => { e.stopPropagation(); setRotation((r) => (r + 90) % 360); };

  // Saat rotasi 90°/270°, scale-down agar gambar tetap muat di container portrait
  const isLandscapeRotation = rotation === 90 || rotation === 270;
  const rotationFit = isLandscapeRotation ? (210 / 297) : 1; // rasio A4

  // Buat CSS transform canvasInner (rotate + zoom + pan)
  const innerTransform = (() => {
    const rot    = `rotate(${rotation}deg)`;
    const fit    = `scale(${rotationFit.toFixed(4)})`;
    const zoom   = zoomed ? "scale(2)" : "";
    const pan    = zoomed ? `translate(${panOffset.x / 2}px, ${panOffset.y / 2}px)` : "";
    return [rot, fit, zoom, pan].filter(Boolean).join(" ");
  })();

  const innerTransition = isDragging
    ? "transform 0s"
    : "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)";

  return (
    <div className={styles.previewContainer}>

      {/* ── Tab Front / Back ── */}
      {hasBack && (
        <div className={styles.sideTabsWrapper}>
          {["front", "back"].map((side) => (
            <button
              key={side}
              className={`${styles.sideTab} ${effectiveSide === side ? styles.sideTabActive : ""}`}
              onClick={() => handleSideChange(side)}
            >
              {side.charAt(0).toUpperCase() + side.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* ── Body: thumbnail + canvas ── */}
      <div className={styles.previewBody}>

        {/* Thumbnail strip */}
        <div className={styles.thumbnailStrip}>
          {customBgUrl && (
            <Thumbnail
              label="Custom"
              imageUrl={`${customBgUrl}?v=1`}
              isActive={activeViewIndex === -1}
              onClick={() => handleViewChange(-1)}
            />
          )}
          {mockupImages.map((url, idx) => (
            <Thumbnail
              key={idx}
              label=""
              imageUrl={`${url}?v=1`}
              isActive={activeViewIndex === idx}
              onClick={() => handleViewChange(idx)}
            />
          ))}
        </div>

        {/* ── Canvas utama ── */}
        <div
          ref={canvasRef}
          className={`
            ${styles.canvasWrapper}
            ${artwork.orientasi === "landscape" ? styles.canvasLandscape : ""}
            ${zoomed ? styles.canvasZoomed : ""}
          `}
          style={{ cursor: zoomed ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
        >
          {displayImageUrl ? (
            <div
              className={styles.canvasInner}
              style={{ transform: innerTransform, transition: innerTransition }}
            >
              {/* Skeleton loading */}
              {!imgLoaded && !imgError && (
                <div className={styles.imgSkeleton}>
                  <div className={styles.skeletonShimmer} />
                </div>
              )}

              {/* Gambar latar */}
              <img
                key={displayImageUrl}
                src={displayImageUrl}
                alt={`${artwork.title} — ${effectiveSide}`}
                className={`${styles.bgImage} ${imgLoaded ? styles.imgVisible : styles.imgHidden}`}
                draggable={false}
                onLoad={() => { setImgLoaded(true); setImgError(false); }}
                onError={() => { setImgLoaded(true); setImgError(true); }}
              />

              {/* Error fallback */}
              {imgError && (
                <div className={styles.imgErrorOverlay}>
                  <span>🖼</span>
                  <p>Gambar tidak dapat dimuat</p>
                  <button
                    className={styles.retryBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImgLoaded(false);
                      setImgError(false);
                    }}
                  >↺ Coba lagi</button>
                </div>
              )}

              {/* Tag elemen yang bisa diedit (hanya di Custom view, tidak saat error) */}
              {showOverlay && imgLoaded && !imgError && activeViewIndex === -1 &&
                editableElements.map((el, idx) => (
                  <EditableElement
                    key={el.id}
                    element={el}
                    index={idx}
                    isSelected={selectedEl === el.id}
                    onSelect={handleSelectEl}
                  />
                ))
              }
            </div>
          ) : (
            <div className={styles.emptyCanvas}>
              <div className={styles.emptyIcon}>🎨</div>
              <p>Belum ada preview</p>
            </div>
          )}

          {/* Kaca pembesar — ikut posisi kursor */}
          {magnifier.visible && imgLoaded && !imgError && !zoomed && displayImageUrl && (
            <div
              className={styles.magnifier}
              style={{
                left:               magnifier.x,
                top:                magnifier.y,
                width:              MAGNIFIER_SIZE,
                height:             MAGNIFIER_SIZE,
                backgroundImage:    `url(${activeViewIndex === -1 && mockupImages[0] ? mockupImages[0] + "?v=1" : displayImageUrl})`,
                backgroundSize:     `${MAGNIFIER_ZOOM * 100}% auto`,
                backgroundPosition: `${magnifier.pctX}% ${magnifier.pctY}%`,
              }}
            />
          )}

          {/* Zoom hint */}
          {!zoomed && imgLoaded && !imgError && (
            <div key={`hint-${activeViewIndex}`} className={styles.zoomHint}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              Klik untuk zoom
            </div>
          )}
          {zoomed && (
            <div key="hint-zoom" className={`${styles.zoomHint} ${styles.zoomHintActive}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
              Klik reset · Seret untuk geser
            </div>
          )}
        </div>

        {/* Tombol rotasi — di luar canvasWrapper (tidak terpotong overflow:hidden), pojok kanan atas */}
        {imgLoaded && !imgError && (
          <div className={styles.rotateControls}>
            <button
              className={`${styles.rotateBtn} ${rotation !== 0 ? styles.rotateBtnActive : ""}`}
              onClick={rotateLeft}
              aria-label="Putar ke kiri"
              title="Putar ke kiri 90°"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M2.5 12A9.5 9.5 0 0 1 12 2.5c2.72 0 5.17 1.13 6.94 2.96"/>
                <path d="M15 2l4.5 3.5L15 9"/>
                <path d="M12 21.5A9.5 9.5 0 0 1 2.5 12"/>
              </svg>
            </button>
            <button
              className={`${styles.rotateBtn} ${rotation !== 0 ? styles.rotateBtnActive : ""}`}
              onClick={rotateRight}
              aria-label="Putar ke kanan"
              title="Putar ke kanan 90°"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21.5 12A9.5 9.5 0 0 0 12 2.5c-2.72 0-5.17 1.13-6.94 2.96"/>
                <path d="M9 2l-4.5 3.5L9 9"/>
                <path d="M12 21.5A9.5 9.5 0 0 0 21.5 12"/>
              </svg>
            </button>
            {rotation !== 0 && (
              <button
                className={styles.rotateBtnReset}
                onClick={(e) => { e.stopPropagation(); setRotation(0); }}
                aria-label="Reset rotasi"
                title="Reset rotasi"
              >
                {rotation}°
              </button>
            )}
          </div>
        )}
      </div>


      {/* ── Toolbar ── */}
      <div className={styles.previewToolbar}>
        <button
          className={`${styles.toolbarBtn} ${showOverlay ? styles.toolbarBtnActive : ""}`}
          onClick={() => setShowOverlay((v) => !v)}
          id="toggle-overlay"
          aria-pressed={showOverlay}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {showOverlay ? (
              <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </>
            ) : (
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
          {showOverlay ? "Sembunyikan" : "Tampilkan"} Area Edit
        </button>

        <div className={styles.elCountPill}>
          <span className={styles.elCountDot} />
          {editableElements.length} area dapat diedit
        </div>
      </div>

      {/* ── Panel elemen yang dipilih ── */}
      {selectedElement && (
        <div
          className={`${styles.elInfoPanel} ${
            selectedElement.type === "file" ? styles.elInfoFile : styles.elInfoText
          }`}
          id="selected-element-panel"
        >
          <div className={styles.elInfoHeader}>
            <span className={styles.elInfoBadge}>
              {selectedElement.type === "file" ? "📁 File" : "✏️ Text"}
            </span>
            <span className={styles.elInfoName}>{selectedElement.label}</span>
            <button
              className={styles.elInfoClose}
              onClick={() => onSelectElement && onSelectElement(null)}
              aria-label="Tutup"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className={styles.elInfoGrid}>
            {[
              { label: "X Axis",    value: `${selectedElement.xAxis.toFixed(1)}%` },
              { label: "Y Axis",    value: `${selectedElement.yAxis.toFixed(1)}%` },
              { label: "Size",      value: `${selectedElement.size}` },
              { label: "Animation", value: selectedElement.animation || "—" },
            ].map(({ label, value }) => (
              <div className={styles.elInfoStat} key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

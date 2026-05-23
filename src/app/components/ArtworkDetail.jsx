"use client";

import { useMemo, useState } from "react";
import styles from "./ArtworkDetail.module.css";
import ScaleSimulationModal from "./ScaleSimulationModal";

/* ── helpers ──────────────────────────── */
function formatDate(str) {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

/* ── sub-components ───────────────────── */
function SpecItem({ icon, label, value }) {
  return (
    <div className={styles.specItem}>
      <span className={styles.specIcon}>{icon}</span>
      <div>
        <p className={styles.specLabel}>{label}</p>
        <p className={styles.specValue}>{value || "—"}</p>
      </div>
    </div>
  );
}

function PackageCard({ id, title, price, features, isFree, isSelected, onSelect }) {
  return (
    <label
      className={`${styles.packageCard} ${isSelected ? styles.pkgSelected : ""}`}
      htmlFor={`pkg-${id}`}
    >
      <input
        type="radio"
        id={`pkg-${id}`}
        name="package"
        className={styles.pkgRadio}
        checked={isSelected}
        onChange={() => onSelect(id)}
      />
      <div className={styles.pkgBody}>
        <div className={styles.pkgRow}>
          <span className={styles.pkgName}>{title}</span>
          <span className={`${styles.pkgPrice} ${isFree ? styles.pkgFree : ""}`}>
            {price}
          </span>
        </div>
        {features?.length > 0 && (
          <ul className={styles.pkgFeatures}>
            {features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        )}
      </div>
    </label>
  );
}

const PACKAGES = [
  {
    id: "free",
    title: "Edit Content (Free)",
    price: "Gratis",
    isFree: true,
    features: [
      "Ubah konten area yang sudah ditentukan seperti konten Teks/Logo/Foto",
      "Maksimal 2x Revisi",
    ],
  },
  {
    id: "artwork",
    title: "Edit Artwork",
    price: "Rp 50.000",
    features: [
      "Mengubah orientasi artwork menjadi Landscape atau Portrait",
      "Mengubah ukuran sesuai yang kamu butuhkan",
      "Mengubah tema warna",
      "Mengganti jenis font",
      "Ubah konten Teks/Logo/Foto (Maksimal 2x Revisi)",
    ],
  },
  {
    id: "new",
    title: "Request Design Baru",
    price: "Rp 150.000",
    features: [
      "Buat artwork baru sesuai dengan kebutuhan kamu",
      "Maksimal 3x Revisi",
    ],
  },
];

/* ── main component ───────────────────── */
export default function ArtworkDetail({ artwork, packageType, setPackageType, onPlaceOrder }) {
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const editableCount = useMemo(() => {
    const els = artwork?.design?.sheets?.[0]?.sides?.front?.elements ?? [];
    return els.filter((e) => e.type === "file" || e.type === "text").length;
  }, [artwork]);

  if (!artwork) return <div className={styles.detail}>No artwork selected</div>;

  return (
    <div className={styles.detail}>

      {/* ── Scale Simulation Modal ── */}
      <ScaleSimulationModal 
        isOpen={isScaleModalOpen} 
        onClose={() => setIsScaleModalOpen(false)} 
      />

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
          onClick={() => setIsSaved(!isSaved)}
          title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
          aria-label="Save to Wishlist"
        >
          <svg viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {artwork.wishlist + (isSaved ? 1 : 0)} saves
        </button>
      </div>

      {/* ── Description ── */}
      <div className={styles.descCard}>
        <div
          className={styles.descOpenText}
          dangerouslySetInnerHTML={{ __html: artwork.description }}
        />
      </div>

      {/* ── SKU / Designer row ── */}
      <div className={styles.metaGrid}>
        <div className={styles.metaCell}>
          <span className={styles.metaKey}>SKU</span>
          <span className={styles.metaVal} id="artwork-sku">{artwork.sku}</span>
        </div>
        <div className={styles.metaCell}>
          <span className={styles.metaKey}>Design by</span>
          <span className={styles.metaVal}>{artwork.user?.name}</span>
        </div>
        <div className={styles.metaCell}>
          <span className={styles.metaKey}>Orientasi</span>
          <span className={styles.metaVal} style={{ textTransform: "capitalize" }}>
            {artwork.orientasi}
          </span>
        </div>
        <div className={styles.metaCell}>
          <span className={styles.metaKey}>
            Skala
            <span 
              className={styles.scaleTooltipWrap} 
              onClick={() => setIsScaleModalOpen(true)}
            >
              <span className={styles.scaleTooltipIcon}>?</span>
              <span className={styles.scaleTooltipText}>Click for scale guidance</span>
            </span>
          </span>
          <span className={styles.metaVal}>{artwork.skala}</span>
        </div>
      </div>

      {/* ── Specs ── */}
      <div className={styles.specsGrid}>
        <SpecItem icon="🔷" label="Shape"     value={artwork.shape} />
        <SpecItem icon="📐" label="Dimension" value={artwork.dimension} />
        <SpecItem icon="🃏" label="Sisi"      value={artwork.sisi} />
        <SpecItem icon="✏️" label="Editable"  value={`${editableCount} elemen`} />
      </div>

      {/* ── Approved ── */}
      <div className={styles.approvedRow}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Disetujui pada <strong>{formatDate(artwork.approvedAt)}</strong>
      </div>

      {/* ── Divider ── */}
      <hr className={styles.divider} />

      {/* ── Package selector ── */}
      <section aria-labelledby="pkg-heading">
        <h2 id="pkg-heading" className={styles.sectionHeading}>Select Package</h2>
        <div className={styles.pkgList} role="radiogroup">
          {PACKAGES.map((p) => (
            <PackageCard
              key={p.id}
              {...p}
              isSelected={packageType === p.id}
              onSelect={setPackageType}
            />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className={styles.ctaRow}>
        <button
          className={styles.orderBtn}
          id="place-order-btn"
          onClick={onPlaceOrder}
        >
          Place Order
        </button>
      </div>

    </div>
  );
}

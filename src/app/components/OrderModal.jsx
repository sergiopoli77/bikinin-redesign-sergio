"use client";

import { useState, useMemo } from "react";
import ArtworkPreview from "./ArtworkPreview";
import styles from "./OrderModal.module.css";

export default function OrderModal({
  artwork,
  selectedElementId,
  onSelectElement,
  orientasi,
  setOrientasi,
  skala,
  setSkala,
  sisi,
  setSisi,
  packageType,
  paperType,
  setPaperType,
  lamination,
  setLamination,
  quantity,
  setQuantity,
  onClose,
}) {
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Pricing configuration
  const packagePrice = useMemo(() => {
    if (packageType === "artwork") return 50000;
    if (packageType === "new") return 150000;
    return 0;
  }, [packageType]);

  const basePrintPricePerPcs = useMemo(() => {
    let base = 1500; // default for Art Carton 260gr
    if (paperType === "Art Paper 150gr") base = 1000;
    if (paperType === "HVS 80gr") base = 600;

    // scale multiplier
    if (skala === "A3") base *= 1.8;
    if (skala === "A5") base *= 0.7;

    // lamination premium
    if (lamination === "Doff 1 Sisi" || lamination === "Glossy 1 Sisi") {
      base += 300;
    }

    // double side premium
    if (sisi === "2 sisi") {
      base *= 1.6;
    }

    return Math.round(base);
  }, [paperType, skala, lamination, sisi]);

  const printTotalPrice = useMemo(() => {
    return basePrintPricePerPcs * quantity;
  }, [basePrintPricePerPcs, quantity]);

  const grandTotal = useMemo(() => {
    return packagePrice + printTotalPrice;
  }, [packagePrice, printTotalPrice]);

  const handleConfirmOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderSuccess(true);
    }, 1800);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.headerIcon}>🛒</span>
            <h2>Spesifikasi & Konfirmasi Cetak</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        {orderSuccess ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>🎉</div>
            <h3>Pemesanan Berhasil!</h3>
            <p>Terima kasih! Pesanan Anda telah diterima dan akan segera kami proses.</p>
            <button className={styles.finishBtn} onClick={onClose}>
              Selesai
            </button>
          </div>
        ) : (
          <div className={styles.modalBody}>
            {/* Left Column: Live dynamic preview */}
            <div className={styles.previewPanel}>
              <div className={styles.previewHeader}>
                <span>Live Preview</span>
                <span className={styles.previewBadge}>
                  {skala} • {orientasi.toUpperCase()} • {sisi.toUpperCase()}
                </span>
              </div>
              <div className={styles.previewWrapper}>
                <ArtworkPreview
                  artwork={artwork}
                  selectedElementId={selectedElementId}
                  onSelectElement={onSelectElement}
                />
              </div>
            </div>

            {/* Right Column: Order Configuration */}
            <div className={styles.configPanel}>
              {/* Layout Specifications */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>1. Spesifikasi Layout</h3>
                <div className={styles.sectionGrid}>
                  {/* Orientation */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Orientasi</label>
                    <div className={styles.radioGrid}>
                      <button
                        className={`${styles.selectCard} ${
                          orientasi === "potrait" ? styles.selectCardActive : ""
                        }`}
                        onClick={() => setOrientasi("potrait")}
                      >
                        <span className={styles.cardIcon}>📄</span>
                        <span className={styles.cardLabel}>Portrait</span>
                      </button>
                      <button
                        className={`${styles.selectCard} ${
                          orientasi === "landscape" ? styles.selectCardActive : ""
                        }`}
                        onClick={() => setOrientasi("landscape")}
                      >
                        <span className={styles.cardIcon} style={{ transform: "rotate(90deg)", display: "inline-block" }}>📄</span>
                        <span className={styles.cardLabel}>Landscape</span>
                      </button>
                    </div>
                  </div>

                  {/* Sisi */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Sisi Halaman</label>
                    <div className={styles.radioGrid}>
                      <button
                        className={`${styles.selectCard} ${
                          sisi === "1 sisi" ? styles.selectCardActive : ""
                        }`}
                        onClick={() => setSisi("1 sisi")}
                      >
                        <span className={styles.cardIcon}>🃏</span>
                        <span className={styles.cardLabel}>1 Sisi</span>
                      </button>
                      <button
                        className={`${styles.selectCard} ${
                          sisi === "2 sisi" ? styles.selectCardActive : ""
                        }`}
                        onClick={() => setSisi("2 sisi")}
                      >
                        <span className={styles.cardIcon}>🃏🃏</span>
                        <span className={styles.cardLabel}>2 Sisi</span>
                      </button>
                    </div>
                  </div>

                  {/* Skala / Ukuran */}
                  <div className={styles.fieldGroup} style={{ gridColumn: "span 2" }}>
                    <label className={styles.fieldLabel}>Ukuran (Skala)</label>
                    <div className={styles.pillGrid}>
                      {["A5", "A4", "A3"].map((sz) => (
                        <button
                          key={sz}
                          className={`${styles.pillBtn} ${skala === sz ? styles.pillBtnActive : ""}`}
                          onClick={() => setSkala(sz)}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Printing Options */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>2. Pilihan Cetak</h3>
                <div className={styles.selectGroup}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="select-paper" className={styles.fieldLabel}>Bahan Kertas</label>
                    <select
                      id="select-paper"
                      className={styles.formSelect}
                      value={paperType}
                      onChange={(e) => setPaperType(e.target.value)}
                    >
                      <option value="Art Carton 260gr">Art Carton 260gr (Tebal, Glossy)</option>
                      <option value="Art Paper 150gr">Art Paper 150gr (Sedang, Brosur)</option>
                      <option value="HVS 80gr">HVS 80gr (Tipis, Harian)</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="select-lamination" className={styles.fieldLabel}>Laminasi</label>
                    <select
                      id="select-lamination"
                      className={styles.formSelect}
                      value={lamination}
                      onChange={(e) => setLamination(e.target.value)}
                    >
                      <option value="Tanpa Laminasi">Tanpa Laminasi</option>
                      <option value="Doff 1 Sisi">Doff 1 Sisi (Matte/Elegan)</option>
                      <option value="Glossy 1 Sisi">Glossy 1 Sisi (Kilap/Cerah)</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="quantity-input" className={styles.fieldLabel}>Kuantitas (Pcs)</label>
                    <div className={styles.qtyContainer}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => setQuantity((q) => Math.max(100, q - 50))}
                      >
                        -
                      </button>
                      <input
                        id="quantity-input"
                        type="number"
                        min="100"
                        step="50"
                        className={styles.qtyInput}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(100, parseInt(e.target.value) || 100))}
                      />
                      <button
                        className={styles.qtyBtn}
                        onClick={() => setQuantity((q) => q + 50)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className={styles.priceSummary}>
                <h4 className={styles.summaryTitle}>Rincian Pembayaran</h4>
                <div className={styles.summaryRow}>
                  <span>Paket Desain ({packageType})</span>
                  <span>Rp {packagePrice.toLocaleString("id-ID")}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Biaya Cetak ({quantity} pcs × Rp {basePrintPricePerPcs.toLocaleString("id-ID")})</span>
                  <span>Rp {printTotalPrice.toLocaleString("id-ID")}</span>
                </div>
                <hr className={styles.summaryDivider} />
                <div className={styles.totalRow}>
                  <span>Total Bayar</span>
                  <span className={styles.totalVal}>Rp {grandTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Submit Row */}
              <div className={styles.actionsRow}>
                <button className={styles.backBtn} onClick={onClose} disabled={isOrdering}>
                  Batal
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={handleConfirmOrder}
                  disabled={isOrdering}
                >
                  {isOrdering ? "Memproses..." : "Konfirmasi & Bayar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

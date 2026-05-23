"use client";

import { useState, useMemo } from "react";
import ArtworkPreview from "./components/ArtworkPreview";
import ArtworkDetail from "./components/ArtworkDetail";
import EditableList from "./components/EditableList";
import OrderModal from "./components/OrderModal";
import { artworkData, getEditableElements } from "./data/artworkData";
import styles from "./page.module.css";

export default function ArtworkDetailPage() {
  const [selectedElementId, setSelectedElementId] = useState(null);

  // Layout specification states (lifted for real-time synchronization)
  const [orientasi, setOrientasi] = useState(artworkData.orientasi || "potrait");
  const [skala, setSkala]         = useState(artworkData.skala || "A4");
  const [sisi, setSisi]           = useState(artworkData.sisi || "1 sisi");
  
  // Package selection state
  const [packageType, setPackageType] = useState("free");

  // State spesifikasi cetak (digunakan di modal pesanan)
  const [paperType, setPaperType]   = useState("Art Carton 260gr");
  const [lamination, setLamination] = useState("Tanpa Laminasi");
  const [quantity, setQuantity]     = useState(100);

  // State untuk buka/tutup modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ambil elemen yang bisa diedit dari sisi depan
  const editableElements = useMemo(() => {
    const sheet = artworkData?.design?.sheets?.[0];
    return getEditableElements(sheet);
  }, []);

  const handleSelectElement = (id) => {
    setSelectedElementId((prev) => (prev === id ? null : id));
  };

  // Sinkronkan spesifikasi artwork dengan state saat ini
  const currentArtwork = useMemo(() => {
    return {
      ...artworkData,
      orientasi,
      skala,
      sisi,
    };
  }, [orientasi, skala, sisi]);

  return (
    <div className={styles.pageWrapper}>
      {/* Main Content Grid (Header and Footer have been removed as requested) */}
      <main className={styles.mainContent} id="main-content">
        {/* Left Column: Preview + Element List */}
        <aside className={styles.leftCol} aria-label="Artwork preview">
          <ArtworkPreview
            artwork={currentArtwork}
            selectedElementId={selectedElementId}
            onSelectElement={handleSelectElement}
          />
          <EditableList
            elements={editableElements}
            selectedId={selectedElementId}
            onSelect={handleSelectElement}
          />
        </aside>

        {/* Right Column: Detail Info + Order */}
        <section className={styles.rightCol} aria-label="Artwork details">
          <ArtworkDetail
            artwork={currentArtwork}
            packageType={packageType}
            setPackageType={setPackageType}
            onPlaceOrder={() => setIsModalOpen(true)}
          />
        </section>
      </main>

      {/* Place Order Modal */}
      {isModalOpen && (
        <OrderModal
          artwork={currentArtwork}
          selectedElementId={selectedElementId}
          onSelectElement={handleSelectElement}
          orientasi={orientasi}
          setOrientasi={setOrientasi}
          skala={skala}
          setSkala={setSkala}
          sisi={sisi}
          setSisi={setSisi}
          packageType={packageType}
          setPackageType={setPackageType}
          paperType={paperType}
          setPaperType={setPaperType}
          lamination={lamination}
          setLamination={setLamination}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
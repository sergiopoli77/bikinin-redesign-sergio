import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bikin.in — Artwork Detail",
  description:
    "Platform desain cetak terbaik. Temukan, kustomisasi, dan pesan artwork berkualitas tinggi di Bikin.in.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}

import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "@primestakecorp/ui/styles.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "600"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased font-sans bg-[#020202] text-white selection:bg-brand-gold">
        {children}
      </body>
    </html>
  );
}
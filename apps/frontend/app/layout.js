// We replace the local import with the shared package style
import "@primestakecorp/ui/styles.css";

export const metadata = {
  title: "Primestakecorp — Private Yield Desk",
  description: "Institutional-grade staking platform demo for investors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* We add 'antialiased' to match modern high-end fintech aesthetics */}
      <body className="antialiased">{children}</body>
    </html>
  );
}
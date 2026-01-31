import "@primestakecorp/ui/styles.css";
import { Sidebar } from "@primestakecorp/ui";

export const metadata = {
  title: "Primestakecorp — Internal Vetting & Ops",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-black flex min-h-screen">
        <Sidebar isAdmin={true} /> {/* Shared Sidebar with Admin context */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
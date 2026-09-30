import type { Metadata } from "next";
import "./globals.css";
import StaticFooter from "@/components/common/StaticFooter";

export const metadata: Metadata = {
  title: "PORTAL DIKLAT KNOWLEDGE MANAGEMENT BPSDM PROVINSI DKI JAKARTA",
  description: "Platform E-Learning dan Knowledge Management BPSDM Provinsi DKI Jakarta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <StaticFooter />
      </body>
    </html>
  );
}

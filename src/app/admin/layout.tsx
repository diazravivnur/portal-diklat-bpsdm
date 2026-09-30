import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar Kiri */}
      <AdminSidebar />

      {/* Konten Dinamis Kanan */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Manajemen Knowledge Management & Diklat
            </h2>
            <p className="text-xs text-slate-500">
              BPSDM Provinsi DKI Jakarta &bull; Panel Administrator
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Sistem Aktif
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

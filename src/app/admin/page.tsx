import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Dashboard Administrator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Selamat datang di panel kontrol Portal Diklat BPSDM.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/diklat" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-bpsdm-blue rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Kelola Diklat</h2>
          <p className="text-sm text-slate-500 mt-1">Atur program diklat, modul, zoom, dan kuis.</p>
        </Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileBarChart, 
  LogOut,
  ShieldCheck
} from "lucide-react";

const navigationItems = [
  { name: "Beranda", href: "/admin", icon: LayoutDashboard },
  { name: "Kelola Diklat", href: "/admin/diklat", icon: BookOpen },
  { name: "Kelola Peserta", href: "/admin/peserta", icon: Users },
  { name: "Laporan", href: "/admin/laporan", icon: FileBarChart },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-bpsdm-blue text-white flex flex-col shrink-0 shadow-xl min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-bpsdm-blue-light/30">
        <div className="flex items-center gap-2 text-bpsdm-gold font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-jayaraya-orange" />
          Administrator Panel
        </div>
        <h1 className="font-extrabold text-lg leading-tight text-white">
          PORTAL DIKLAT
        </h1>
        <p className="text-xs text-blue-200 mt-1">BPSDM Provinsi DKI Jakarta</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-bpsdm-gold text-bpsdm-blue-dark font-bold shadow-md shadow-bpsdm-gold/20"
                  : "text-blue-100 hover:bg-bpsdm-blue-light/40 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-bpsdm-blue-dark" : "text-blue-300"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Session Quick Info */}
      <div className="p-4 border-t border-bpsdm-blue-light/30 bg-bpsdm-blue-dark/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-bpsdm-gold text-bpsdm-blue font-bold flex items-center justify-center text-sm">
            ADM
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-white">Admin BPSDM</p>
            <p className="text-xs text-blue-200 truncate">admin@jakarta.go.id</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-red-300 hover:text-red-100 transition-colors py-1 font-medium"
        >
          <LogOut className="w-4 h-4" />
          Keluar Sesi
        </Link>
      </div>
    </aside>
  );
}

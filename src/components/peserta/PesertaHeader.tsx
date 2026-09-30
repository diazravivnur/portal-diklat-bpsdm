"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, LogOut, User } from "lucide-react";
import { getSessionUser, clearSessionUser } from "@/lib/firestoreService";
import { UserProfile } from "@/types";

export default function PesertaHeader() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const user = getSessionUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    clearSessionUser();
    router.push("/");
  };

  return (
    <header className="bg-bpsdm-blue text-white shadow-md border-b border-bpsdm-blue-light/40 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/peserta" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bpsdm-gold flex items-center justify-center text-bpsdm-blue-dark shadow">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight leading-tight">
              PORTAL DIKLAT KM
            </h1>
            <p className="text-xs text-bpsdm-gold font-medium">BPSDM PROVINSI DKI JAKARTA</p>
          </div>
        </Link>

        {/* Navigation & User Profile */}
        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <Link href="/peserta" className="text-white hover:text-bpsdm-gold transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Katalog Diklat
            </Link>
          </nav>

          <div className="flex items-center gap-3 pl-4 border-l border-bpsdm-blue-light/50">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-white">
                {currentUser?.username || "Diaz Raviv Nur"}
              </p>
              <p className="text-[11px] text-blue-200">
                NIP: {currentUser?.nip || "223043"}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-jayaraya-orange text-white font-bold flex items-center justify-center text-xs shadow">
              {currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : "DR"}
            </div>
            <button
              onClick={handleLogout}
              title="Keluar Akun"
              className="p-1.5 hover:bg-white/10 rounded-lg text-blue-200 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

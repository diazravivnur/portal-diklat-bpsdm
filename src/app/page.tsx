import Link from "next/link";
import { ShieldCheck, GraduationCap, ArrowRight, BookOpen, Layers } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-100">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-bpsdm-blue text-white p-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-bpsdm-gold/20 text-bpsdm-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-bpsdm-gold/30">
            Badan Pengembangan Sumber Daya Manusia
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            PORTAL DIKLAT KNOWLEDGE MANAGEMENT
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm mt-2">
            Provinsi Daerah Khusus Ibukota Jakarta
          </p>
        </div>

        {/* Portal Entry Options */}
        <div className="p-8 sm:p-10 space-y-6">
          <p className="text-center text-slate-600 text-sm max-w-lg mx-auto">
            Silakan pilih akses dashboard sesuai peran Anda dalam ekosistem pembelajaran digital BPSDM DKI Jakarta:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Opsi Admin */}
            <Link
              href="/admin"
              className="p-6 rounded-xl border-2 border-slate-200 hover:border-bpsdm-blue hover:shadow-lg transition-all flex flex-col group bg-slate-50 hover:bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-bpsdm-blue text-bpsdm-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-bpsdm-blue transition-colors">
                Dashboard Admin
              </h2>
              <p className="text-xs text-slate-500 mt-2 flex-1">
                Kelola diklat, upload materi PDF, atur sesi tautan Zoom, dan kelola butir soal kuis secara terintegrasi (Sistem Tabs).
              </p>
              <div className="mt-4 flex items-center text-xs font-bold text-bpsdm-blue gap-1">
                Masuk Admin Panel <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            {/* Opsi Peserta */}
            <Link
              href="/peserta"
              className="p-6 rounded-xl border-2 border-slate-200 hover:border-jayaraya-orange hover:shadow-lg transition-all flex flex-col group bg-slate-50 hover:bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-jayaraya-orange text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 group-hover:text-jayaraya-orange transition-colors">
                Dashboard Peserta
              </h2>
              <p className="text-xs text-slate-500 mt-2 flex-1">
                Akses katalog diklat mandiri, ikuti alur belajar sekuensial (Pretest &rarr; Modul PDF &rarr; Zoom &rarr; Posttest), dan selesaikan sertifikasi.
              </p>
              <div className="mt-4 flex items-center text-xs font-bold text-jayaraya-orange gap-1">
                Masuk Ruang Peserta <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function StaticFooter() {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-300 py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm gap-2">
        <div className="text-slate-400">
          PORTAL DIKLAT KNOWLEDGE MANAGEMENT &copy; {new Date().getFullYear()} BPSDM PROVINSI DKI JAKARTA
        </div>
        <div className="font-semibold text-bpsdm-gold-light tracking-wide bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
          Created by Dr. Ima Rohimah, M.Pd.
        </div>
      </div>
    </footer>
  );
}

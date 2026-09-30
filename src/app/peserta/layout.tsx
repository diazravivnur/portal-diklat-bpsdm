import React from "react";
import PesertaHeader from "@/components/peserta/PesertaHeader";

export default function PesertaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <PesertaHeader />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

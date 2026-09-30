"use client";

import { useEffect, useState } from "react";
import { FileBarChart } from "lucide-react";
import { getAllEnrollments } from "@/lib/firestoreService";
import { Enrollment } from "@/types";

export default function AdminLaporanPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEnrollments();
      setEnrollments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "lulus":
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase">Lulus</span>;
      case "modul_selesai":
      case "pretest_selesai":
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold uppercase">Sedang Berjalan</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">Belum Mulai</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Laporan Hasil Diklat
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau progress, status kelulusan, serta nilai pretest dan posttest peserta.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Memuat data...</div>
        ) : enrollments.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <FileBarChart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            Belum ada data partisipasi / enrollment dari peserta.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Nama Peserta</th>
                  <th className="px-6 py-4">Judul Diklat</th>
                  <th className="px-6 py-4 text-center">Skor Pretest</th>
                  <th className="px-6 py-4 text-center">Skor Posttest</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {enrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {enr.userName || "Peserta (Tidak diketahui)"}
                    </td>
                    <td className="px-6 py-4">
                      {enr.courseTitle || "Diklat"}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold">
                      {enr.skorPretest !== null && enr.skorPretest !== undefined ? enr.skorPretest : "-"}
                    </td>
                    <td className="px-6 py-4 text-center font-semibold">
                      {enr.skorPosttest !== null && enr.skorPosttest !== undefined ? enr.skorPosttest : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(enr.statusProgress)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


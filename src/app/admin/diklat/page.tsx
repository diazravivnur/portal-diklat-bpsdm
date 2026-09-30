"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, BookOpen } from "lucide-react";
import { getAllCourses, deleteCourse } from "@/lib/firestoreService";
import { Course } from "@/types";

export default function AdminDiklatPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus diklat ini?")) return;
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (error) {
      console.error("Gagal menghapus", error);
      alert("Gagal menghapus diklat");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Kelola Diklat
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftar program diklat yang tersedia di portal BPSDM.
          </p>
        </div>
        <Link 
          href="/admin/diklat/create"
          className="inline-flex items-center gap-2 bg-bpsdm-blue hover:bg-bpsdm-blue-light text-white font-semibold px-4 py-2.5 rounded-lg shadow transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Diklat Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Memuat data...</div>
        ) : courses.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            Belum ada program diklat yang ditambahkan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Judul Diklat</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Durasi</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {course.judul}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                        {course.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4">{course.durasi}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <button
                        onClick={() => alert('Fitur edit masih dalam pengembangan (Silakan hapus lalu buat ulang).')}
                        className="text-amber-500 hover:text-amber-700 p-1 transition-colors"
                        title="Edit Diklat"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => course.id && handleDelete(course.id)}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        title="Hapus Diklat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

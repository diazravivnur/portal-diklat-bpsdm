"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, Award, ArrowRight, Database, RefreshCw } from "lucide-react";
import { getAllCourses, seedSampleCoursesIfEmpty } from "@/lib/firestoreService";
import { Course } from "@/types";

export default function PesertaCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedSampleCoursesIfEmpty();
      await fetchCourses();
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full">
      {/* Hero Welcome */}
      <div className="bg-gradient-to-r from-bpsdm-blue to-bpsdm-blue-light text-white rounded-2xl p-8 mb-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-bpsdm-gold/20 text-bpsdm-gold font-bold text-xs uppercase tracking-wider rounded-full mb-3 border border-bpsdm-gold/30">
            Katalog Pembelajaran Mandiri &bull; Live Firestore
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Selamat Datang di Portal Diklat ASN BerAKHLAK
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Tingkatkan kapasitas dan kapabilitas kinerja birokrasi melalui modul terpadu, bimbingan sinkronus, dan asesmen bertahap berbasis Knowledge Management.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-10 pointer-events-none">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Course Grid Layout */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Daftar Program Diklat Tersedia
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Data tersinkronisasi langsung dari Google Cloud Firestore: <span className="font-mono text-bpsdm-blue">courses</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchCourses}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Muat Ulang
            </button>
            {courses.length === 0 && !loading && (
              <button
                type="button"
                onClick={handleSeed}
                disabled={seeding}
                className="px-3 py-1.5 bg-bpsdm-blue text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors hover:bg-bpsdm-blue-light"
              >
                <Database className="w-3.5 h-3.5 text-bpsdm-gold" />
                {seeding ? "Menginisialisasi..." : "Inisialisasi Data Contoh Firestore"}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-bpsdm-blue mb-2" />
            <p className="text-sm font-medium">Menghubungkan ke Firebase Firestore...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <Database className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Koleksi Diklat Masih Kosong di Firestore</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Belum ada program diklat yang dipublikasikan di database Firestore. Anda dapat membuat diklat baru melalui Admin Panel atau mengklik inisialisasi di bawah.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleSeed}
                disabled={seeding}
                className="px-4 py-2 bg-bpsdm-blue hover:bg-bpsdm-blue-light text-white text-xs font-bold rounded-lg shadow transition-colors"
              >
                {seeding ? "Membuat Data..." : "Inisialisasi Sample Diklat ke Firestore"}
              </button>
              <Link
                href="/admin"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                Buka Admin Panel
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-slate-200 overflow-hidden">
                  <img
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"}
                    alt={course.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-bpsdm-blue/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {course.kategori || "Kompetensi ASN"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-800 text-base line-clamp-2 mb-2 group-hover:text-bpsdm-blue transition-colors">
                    {course.judul}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 flex-1">
                    {course.deskripsi}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-bpsdm-blue" />
                      {course.modules?.length || 0} Modul
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-jayaraya-orange" />
                      {course.durasi || "32 JP"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-bpsdm-gold" />
                      Sertifikat
                    </span>
                  </div>

                  {/* Enter Button */}
                  <Link
                    href={`/peserta/course/${course.id}`}
                    className="w-full py-2.5 px-4 bg-bpsdm-blue hover:bg-bpsdm-blue-light text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    Masuk Ruang Kelas
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

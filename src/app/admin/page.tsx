import React from "react";
import CourseCreationForm from "@/components/admin/CourseCreationForm";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Formulir Pembuatan & Pengaturan Diklat Baru
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gunakan sistem tab di bawah ini untuk mengatur informasi program, materi PDF digital, jadwal sinkronus Zoom, dan evaluasi soal pretest/posttest.
        </p>
      </div>

      <CourseCreationForm />
    </div>
  );
}

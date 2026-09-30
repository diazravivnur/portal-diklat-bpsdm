import React from "react";
import CourseCreationForm from "@/components/admin/CourseCreationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateDiklatPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/diklat"
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Tambah Program Diklat Baru
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Isi formulir di bawah ini untuk menambahkan program diklat ke dalam sistem.
          </p>
        </div>
      </div>
      <CourseCreationForm />
    </div>
  );
}

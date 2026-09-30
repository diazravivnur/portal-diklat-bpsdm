"use client";

import { useState } from "react";
import { 
  FileText, 
  Video, 
  HelpCircle, 
  Layers, 
  Plus, 
  Save, 
  Trash2, 
  UploadCloud,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { createCourse } from "@/lib/firestoreService";
import { ModuleItem, ZoomMeeting, QuestionItem } from "@/types";

export default function CourseCreationForm() {
  const [activeTab, setActiveTab] = useState<"umum" | "modul" | "zoom" | "kuis">("umum");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // State Form Diklat Umum
  const [judul, setJudul] = useState("Diklat Penerapan Knowledge Management ASN BerAKHLAK");
  const [deskripsi, setDeskripsi] = useState("Meningkatkan kompetensi ASN dalam mengelola pengetahuan tacit dan explicit di lingkungan instansi Pemprov DKI Jakarta.");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60");
  const [kategori, setKategori] = useState("Kompetensi Manajerial");
  const [durasi, setDurasi] = useState("32 JP");

  // State Modul PDF
  const [modules, setModules] = useState<ModuleItem[]>([
    { 
      id: "mod-1", 
      judul: "Modul 1: Pengantar Knowledge Management Pemerintahan", 
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", 
      urutan: 1 
    },
    { 
      id: "mod-2", 
      judul: "Modul 2: Implementasi Knowledge Sharing di Pemprov DKI", 
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", 
      urutan: 2 
    }
  ]);

  // State Sesi Zoom
  const [zoomMeetings, setZoomMeetings] = useState<ZoomMeeting[]>([
    { 
      id: "zoom-1", 
      topik: "Sesi Sinkronus Pembekalan & Diskusi Interaktif Bersama Widyaiswara", 
      joinUrl: "https://zoom.us/j/88212934012", 
      jadwal: "Senin, 09:00 - 11:30 WIB" 
    }
  ]);

  // State Kuis
  const [quizType, setQuizType] = useState<"pretest" | "posttest">("pretest");
  const [pretestQuestions, setPretestQuestions] = useState<QuestionItem[]>([
    {
      id: "q-pre-1",
      pertanyaan: "Apa fungsi utama dari Knowledge Management di lingkungan pemerintahan DKI Jakarta?",
      pilihan: [
        "Mendokumentasikan tacit knowledge menjadi explicit knowledge",
        "Menghapus arsip manual tanpa digitalisasi",
        "Mengurangi interaksi antar dinas",
        "Sebagai formalitas pelaporan tahunan"
      ],
      kunciJawaban: 0,
      bobot: 50
    },
    {
      id: "q-pre-2",
      pertanyaan: "Bagaimana cara memfasilitasi transfer pengetahuan antar pegawai secara berkelanjutan?",
      pilihan: [
        "Membentuk Komunitas Praktisi (Community of Practice) dan repository digital",
        "Menyimpan pengetahuan secara privat",
        "Melarang rotasi jabatan",
        "Menghapus sesi mentoring"
      ],
      kunciJawaban: 0,
      bobot: 50
    }
  ]);

  const [posttestQuestions, setPosttestQuestions] = useState<QuestionItem[]>([
    {
      id: "q-post-1",
      pertanyaan: "Indikator keberhasilan penerapan budaya knowledge sharing aparatur adalah...",
      pilihan: [
        "Adanya replikasi inovasi dan kemudahan akses SOP digital lintas OPD",
        "Meningkatnya dokumen rahasia tanpa izin",
        "Penurunan jumlah pelatihan tahunan",
        "Pemberian hukuman bagi yang bertanya"
      ],
      kunciJawaban: 0,
      bobot: 50
    },
    {
      id: "q-post-2",
      pertanyaan: "Langkah pertama dalam siklus manajemen pengetahuan (Knowledge Cycle) adalah...",
      pilihan: [
        "Knowledge Identification & Capture (Identifikasi dan Penangkapan Pengetahuan)",
        "Knowledge Destruction",
        "Pemberian Hak Paten",
        "Pencetakan Massal Dokumen"
      ],
      kunciJawaban: 0,
      bobot: 50
    }
  ]);

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: `mod-${Date.now()}`,
        judul: `Modul ${modules.length + 1}: Bahan Ajar Baru`,
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        urutan: modules.length + 1
      }
    ]);
  };

  const updateModule = (index: number, field: keyof ModuleItem, value: any) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  const addZoom = () => {
    setZoomMeetings([
      ...zoomMeetings,
      {
        id: `zoom-${Date.now()}`,
        topik: "Sesi Tambahan: Diskusi Mentoring",
        joinUrl: "https://zoom.us",
        jadwal: "Jumat, 13:30 - 15:00 WIB"
      }
    ]);
  };

  const updateZoom = (index: number, field: keyof ZoomMeeting, value: string) => {
    const updated = [...zoomMeetings];
    updated[index] = { ...updated[index], [field]: value };
    setZoomMeetings(updated);
  };

  const currentQuestions = quizType === "pretest" ? pretestQuestions : posttestQuestions;
  const setCurrentQuestions = (newQuestions: QuestionItem[]) => {
    if (quizType === "pretest") {
      setPretestQuestions(newQuestions);
    } else {
      setPosttestQuestions(newQuestions);
    }
  };

  const addQuestion = () => {
    setCurrentQuestions([
      ...currentQuestions,
      {
        id: `q-${Date.now()}`,
        pertanyaan: "",
        pilihan: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
        kunciJawaban: 0,
        bobot: 25
      }
    ]);
  };

  const updateQuestion = (index: number, field: keyof QuestionItem, value: any) => {
    const updated = [...currentQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentQuestions(updated);
  };

  const updateOption = (qIndex: number, optionIndex: number, value: string) => {
    const updated = [...currentQuestions];
    const newOptions = [...updated[qIndex].pilihan];
    newOptions[optionIndex] = value;
    updated[qIndex].pilihan = newOptions;
    setCurrentQuestions(updated);
  };

  const handleSaveToFirestore = async () => {
    if (!judul.trim()) {
      setFeedback({ type: "error", message: "Judul diklat tidak boleh kosong!" });
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);

      const coursePayload = {
        judul,
        deskripsi,
        thumbnail: thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
        kategori,
        durasi,
        modules,
        zoomMeetings,
        quizzes: {
          pretest: {
            tipe: "pretest" as const,
            judul: `Pretest: ${judul}`,
            durasiMenit: 30,
            questions: pretestQuestions
          },
          posttest: {
            tipe: "posttest" as const,
            judul: `Posttest: ${judul}`,
            durasiMenit: 45,
            questions: posttestQuestions
          }
        }
      };

      const docId = await createCourse(coursePayload);
      setFeedback({ 
        type: "success", 
        message: `Program Diklat berhasil disimpan ke Firestore! ID Dokumen: ${docId}` 
      });
    } catch (err: any) {
      console.error(err);
      setFeedback({ 
        type: "error", 
        message: `Gagal menyimpan ke Firestore: ${err?.message || "Terjadi kesalahan koneksi"}` 
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Alert Notifikasi */}
      {feedback && (
        <div className={`p-4 flex items-center gap-3 border-b text-sm font-medium ${
          feedback.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {feedback.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header Tab Bar */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("umum")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === "umum"
              ? "border-bpsdm-blue text-bpsdm-blue bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4 text-bpsdm-blue" />
          1. Informasi Umum
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("modul")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === "modul"
              ? "border-bpsdm-blue text-bpsdm-blue bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4 text-jayaraya-orange" />
          2. Modul PDF ({modules.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("zoom")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === "zoom"
              ? "border-bpsdm-blue text-bpsdm-blue bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Video className="w-4 h-4 text-blue-600" />
          3. Sesi Zoom ({zoomMeetings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("kuis")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === "kuis"
              ? "border-bpsdm-blue text-bpsdm-blue bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          4. Evaluasi Kuis (Pre/Post)
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* TAB 1: INFORMASI UMUM */}
        {activeTab === "umum" && (
          <div className="space-y-5 max-w-3xl">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Judul Diklat
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Diklat Penerapan Knowledge Management ASN BerAKHLAK"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bpsdm-blue/50 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Kategori Diklat
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bpsdm-blue/50 text-sm bg-white"
                >
                  <option value="Kompetensi Manajerial">Kompetensi Manajerial</option>
                  <option value="Kompetensi Teknis">Kompetensi Teknis</option>
                  <option value="Kompetensi Sosio-Kultural">Kompetensi Sosio-Kultural</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Durasi Pelatihan
                </label>
                <input
                  type="text"
                  value={durasi}
                  onChange={(e) => setDurasi(e.target.value)}
                  placeholder="Contoh: 32 JP"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bpsdm-blue/50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Deskripsi Program Diklat
              </label>
              <textarea
                rows={4}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Jelaskan silabus, tujuan, sasaran peserta..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bpsdm-blue/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                URL Banner / Thumbnail
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bpsdm-blue/50 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODUL PDF */}
        {activeTab === "modul" && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-600">
                Kelola file materi digital / buku ajar PDF yang akan disinkronkan ke basis data Firestore.
              </p>
              <button
                type="button"
                onClick={addModule}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-bpsdm-blue text-white hover:bg-bpsdm-blue-light transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Modul
              </button>
            </div>

            {modules.map((mod, idx) => (
              <div key={mod.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-bpsdm-blue text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  {idx + 1}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Judul Materi</label>
                    <input
                      type="text"
                      value={mod.judul}
                      onChange={(e) => updateModule(idx, "judul", e.target.value)}
                      placeholder="Judul modul..."
                      className="w-full px-3 py-2 text-sm rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">URL File PDF (Online Viewer)</label>
                    <input
                      type="text"
                      value={mod.pdfUrl}
                      onChange={(e) => updateModule(idx, "pdfUrl", e.target.value)}
                      placeholder="https://.../materi.pdf"
                      className="w-full px-3 py-2 text-sm rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModules(modules.filter((_, i) => i !== idx))}
                  className="text-red-500 hover:text-red-700 p-2 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SESI ZOOM */}
        {activeTab === "zoom" && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-slate-600">
                Konfigurasi tautan tatap maya sinkronus (Webinar / Kelas Interaktif Zoom).
              </p>
              <button
                type="button"
                onClick={addZoom}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-bpsdm-blue text-white hover:bg-bpsdm-blue-light transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Sesi
              </button>
            </div>

            {zoomMeetings.map((zm, idx) => (
              <div key={zm.id} className="p-5 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-bpsdm-blue">Sesi Tatap Maya #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => setZoomMeetings(zoomMeetings.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Topik Pertemuan</label>
                  <input
                    type="text"
                    value={zm.topik}
                    onChange={(e) => updateZoom(idx, "topik", e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded border border-slate-300 bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Join URL / Tautan Zoom</label>
                    <input
                      type="text"
                      value={zm.joinUrl}
                      onChange={(e) => updateZoom(idx, "joinUrl", e.target.value)}
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-3 py-2 text-sm rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Waktu Pelaksanaan</label>
                    <input
                      type="text"
                      value={zm.jadwal}
                      onChange={(e) => updateZoom(idx, "jadwal", e.target.value)}
                      placeholder="Contoh: Senin, 09:00 - 11:30 WIB"
                      className="w-full px-3 py-2 text-sm rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: EVALUASI KUIS */}
        {activeTab === "kuis" && (
          <div className="space-y-5 max-w-4xl">
            <div className="flex items-center gap-4 border-b pb-4">
              <label className="text-sm font-semibold text-slate-700">Tipe Kuis:</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setQuizType("pretest")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    quizType === "pretest"
                      ? "bg-bpsdm-blue text-white shadow-sm"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  Pretest ({pretestQuestions.length} Soal)
                </button>
                <button
                  type="button"
                  onClick={() => setQuizType("posttest")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    quizType === "posttest"
                      ? "bg-bpsdm-blue text-white shadow-sm"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  Posttest ({posttestQuestions.length} Soal)
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">
                Daftar butir soal {quizType.toUpperCase()} ({currentQuestions.length} Soal)
              </span>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-bpsdm-blue text-white hover:bg-bpsdm-blue-light"
              >
                <Plus className="w-4 h-4" />
                Tambah Butir Soal
              </button>
            </div>

            {currentQuestions.map((q, qIndex) => (
              <div key={q.id} className="p-5 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-bpsdm-blue">Soal #{qIndex + 1}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">Bobot:</span>
                    <input
                      type="number"
                      value={q.bobot}
                      onChange={(e) => updateQuestion(qIndex, "bobot", Number(e.target.value))}
                      className="w-16 px-2 py-1 text-xs border rounded bg-white text-center font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentQuestions(currentQuestions.filter((_, i) => i !== qIndex))}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={q.pertanyaan}
                  onChange={(e) => updateQuestion(qIndex, "pertanyaan", e.target.value)}
                  placeholder="Tuliskan pertanyaan di sini..."
                  rows={2}
                  className="w-full p-2.5 text-sm rounded border border-slate-300 bg-white"
                />

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Pilihan Jawaban (Klik radio untuk menandai Kunci Jawaban yang benar):
                  </label>
                  {q.pilihan.map((pil, pilIdx) => (
                    <div key={pilIdx} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`kunci-${q.id}`}
                        checked={q.kunciJawaban === pilIdx}
                        onChange={() => updateQuestion(qIndex, "kunciJawaban", pilIdx)}
                        className="text-bpsdm-blue focus:ring-bpsdm-blue h-4 w-4"
                      />
                      <input
                        type="text"
                        value={pil}
                        onChange={(e) => updateOption(qIndex, pilIdx, e.target.value)}
                        placeholder={`Pilihan ${String.fromCharCode(65 + pilIdx)}`}
                        className="flex-1 px-3 py-1.5 text-sm border rounded bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Save Button */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Terhubung ke Firebase Firestore (<span className="font-mono text-bpsdm-blue">bpsdm-portal-diklat</span>)
          </p>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveToFirestore}
            className="flex items-center gap-2 bg-bpsdm-blue hover:bg-bpsdm-blue-light text-white font-semibold px-6 py-2.5 rounded-lg shadow transition-colors text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-bpsdm-gold" />
            {isSaving ? "Menyimpan ke Firestore..." : "Simpan Seluruh Konfigurasi Diklat ke Firestore"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Lock, 
  FileText, 
  Video, 
  HelpCircle, 
  Award, 
  ChevronRight,
  ExternalLink,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  getCourseById, 
  getOrCreateEnrollment, 
  updateEnrollmentProgress, getSessionUser
} from "@/lib/firestoreService";
import { Course, Enrollment, QuestionItem } from "@/types";

interface LearningRoomProps {
  courseId: string;
}

export default function LearningRoom({ courseId }: LearningRoomProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Navigasi tahapan aktif
  const [activeStep, setActiveStep] = useState<"pretest" | "modul" | "zoom" | "posttest" | "selesai">("pretest");

  // State Pengerjaan Kuis
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState<boolean>(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  // Ambil data user yang sedang login (session)
  const sessionUser = getSessionUser();
  const currentUserId = sessionUser?.uid || "";
  const currentUserName = sessionUser?.username || "";

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorMsg(null);
        
        // 1. Ambil data kursus dari Firestore
        const courseData = await getCourseById(courseId);
        if (!courseData) {
          setErrorMsg("Data kursus tidak ditemukan di database Firestore.");
          setLoading(false);
          return;
        }
        setCourse(courseData);

        // 2. Ambil atau inisialisasi status enrollment peserta dari Firestore
        const enrollData = await getOrCreateEnrollment(currentUserId, courseId, {
          userName: currentUserName,
          courseTitle: courseData.judul
        });
        setEnrollment(enrollData);

        // Arahkan navigasi awal sesuai progress yang tersimpan di Firestore
        if (enrollData.skorPosttest !== null) {
          setActiveStep("selesai");
        } else if (enrollData.modulSelesai) {
          setActiveStep("posttest");
        } else if (enrollData.skorPretest !== null) {
          setActiveStep("modul");
        } else {
          setActiveStep("pretest");
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg(`Gagal memuat data dari Firestore: ${err?.message || "Koneksi terganggu"}`);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadData();
    }
  }, [courseId]);

  const skorPretest = enrollment?.skorPretest ?? null;
  const modulSelesai = enrollment?.modulSelesai ?? false;
  const skorPosttest = enrollment?.skorPosttest ?? null;

  // Aturan sekuensial:
  // 1. Modul PDF & Zoom terbuka jika Pretest sudah dinilai (skorPretest !== null)
  const isPretestCompleted = skorPretest !== null;
  // 2. Posttest terbuka jika Pretest selesai dan Modul sudah diselesaikan
  const isPosttestUnlocked = isPretestCompleted && modulSelesai;

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmitQuiz = async (type: "pretest" | "posttest") => {
    if (!enrollment?.id || !course) return;

    try {
      setIsSubmittingQuiz(true);
      const quizList: QuestionItem[] = 
        type === "pretest" 
          ? (course.quizzes?.pretest?.questions || [])
          : (course.quizzes?.posttest?.questions || []);

      let totalScore = 0;
      quizList.forEach((q, idx) => {
        if (userAnswers[idx] === q.kunciJawaban) {
          totalScore += q.bobot || Math.round(100 / quizList.length);
        }
      });

      // Batasi max 100
      totalScore = Math.min(100, totalScore);

      if (type === "pretest") {
        await updateEnrollmentProgress(enrollment.id, {
          skorPretest: totalScore,
          statusProgress: "pretest_selesai"
        });
        setEnrollment({
          ...enrollment,
          skorPretest: totalScore,
          statusProgress: "pretest_selesai"
        });
        setActiveStep("modul");
      } else {
        await updateEnrollmentProgress(enrollment.id, {
          skorPosttest: totalScore,
          statusProgress: "lulus"
        });
        setEnrollment({
          ...enrollment,
          skorPosttest: totalScore,
          statusProgress: "lulus"
        });
        setActiveStep("selesai");
      }

      setUserAnswers({});
    } catch (err: any) {
      console.error(err);
      alert(`Gagal menyimpan nilai kuis ke Firestore: ${err?.message}`);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleMarkModuleComplete = async () => {
    if (!enrollment?.id) return;
    try {
      await updateEnrollmentProgress(enrollment.id, {
        modulSelesai: true,
        statusProgress: "modul_selesai"
      });
      setEnrollment({
        ...enrollment,
        modulSelesai: true,
        statusProgress: "modul_selesai"
      });
    } catch (err: any) {
      console.error(err);
      alert(`Gagal memperbarui progress modul di Firestore: ${err?.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-bpsdm-blue mb-3" />
        <p className="font-semibold text-sm">Sinkronisasi Kelas & Progress Pembelajaran dari Firestore...</p>
      </div>
    );
  }

  if (errorMsg || !course) {
    return (
      <div className="flex-1 p-8 max-w-2xl mx-auto my-auto text-center">
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Gagal Membuka Ruang Kelas</h2>
          <p className="text-xs text-slate-600">{errorMsg || "Kursus tidak ditemukan"}</p>
        </div>
      </div>
    );
  }

  const pretestQuiz = course.quizzes?.pretest;
  const posttestQuiz = course.quizzes?.posttest;
  const activeModule = course.modules?.[activeModuleIndex] || course.modules?.[0];
  const zoomSession = course.zoomMeetings?.[0];

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Banner Kursus */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-bpsdm-blue">
            Ruang Kelas Pembelajaran Mandiri &bull; ID: {course.id}
          </span>
          <h2 className="text-base font-bold text-slate-800">
            {course.judul}
          </h2>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-slate-700">{enrollment?.userName}</p>
          <p className="text-[10px] text-slate-400 font-mono">UID: {enrollment?.userId}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-full">
        {/* 25% KOLOM KIRI: Navigasi Sekuensial */}
        <aside className="w-full md:w-1/4 bg-white border-r border-slate-200 p-5 flex flex-col shrink-0">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-bpsdm-gold-dark bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Alur Pembelajaran Sekuensial
            </span>
            <h2 className="font-bold text-slate-800 text-sm mt-1">
              Silabus Terstruktur (Firestore Synced)
            </h2>
          </div>

          <nav className="space-y-2 flex-1">
            {/* STEP 1: Pretest */}
            <button
              type="button"
              onClick={() => setActiveStep("pretest")}
              className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                activeStep === "pretest"
                  ? "bg-bpsdm-blue text-white border-bpsdm-blue shadow-sm"
                  : isPretestCompleted
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isPretestCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <div>
                  <p>1. Pretest Asesmen</p>
                  <p className="text-[10px] font-normal opacity-80">
                    {isPretestCompleted ? `Skor: ${skorPretest} Poin` : "Wajib diselesaikan"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            {/* STEP 2: Modul PDF (Terkunci jika belum pretest) */}
            <button
              type="button"
              disabled={!isPretestCompleted}
              onClick={() => isPretestCompleted && setActiveStep("modul")}
              className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                !isPretestCompleted
                  ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
                  : activeStep === "modul"
                  ? "bg-bpsdm-blue text-white border-bpsdm-blue shadow-sm"
                  : modulSelesai
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {!isPretestCompleted ? (
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                ) : modulSelesai ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-jayaraya-orange shrink-0" />
                )}
                <div>
                  <p>2. Modul Digital ({course.modules?.length || 0} PDF)</p>
                  <p className="text-[10px] font-normal opacity-80">
                    {!isPretestCompleted 
                      ? "Terkunci (Selesaikan Pretest)" 
                      : modulSelesai 
                      ? "Selesai dibaca" 
                      : "Siap dipelajari"}
                  </p>
                </div>
              </div>
              {!isPretestCompleted ? <Lock className="w-3.5 h-3.5" /> : <ChevronRight className="w-4 h-4 opacity-70" />}
            </button>

            {/* STEP 3: Sesi Zoom */}
            <button
              type="button"
              disabled={!isPretestCompleted}
              onClick={() => isPretestCompleted && setActiveStep("zoom")}
              className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                !isPretestCompleted
                  ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
                  : activeStep === "zoom"
                  ? "bg-bpsdm-blue text-white border-bpsdm-blue shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {!isPretestCompleted ? (
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <Video className="w-4 h-4 text-blue-500 shrink-0" />
                )}
                <div>
                  <p>3. Sesi Tatap Maya Zoom</p>
                  <p className="text-[10px] font-normal opacity-80">
                    {!isPretestCompleted ? "Terkunci" : "Webinar Widyaiswara"}
                  </p>
                </div>
              </div>
              {!isPretestCompleted ? <Lock className="w-3.5 h-3.5" /> : <ChevronRight className="w-4 h-4 opacity-70" />}
            </button>

            {/* STEP 4: Posttest Evaluasi */}
            <button
              type="button"
              disabled={!isPosttestUnlocked}
              onClick={() => isPosttestUnlocked && setActiveStep("posttest")}
              className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                !isPosttestUnlocked
                  ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400"
                  : activeStep === "posttest"
                  ? "bg-bpsdm-blue text-white border-bpsdm-blue shadow-sm"
                  : skorPosttest !== null
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {!isPosttestUnlocked ? (
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                ) : skorPosttest !== null ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Award className="w-4 h-4 text-bpsdm-gold shrink-0" />
                )}
                <div>
                  <p>4. Evaluasi Akhir (Posttest)</p>
                  <p className="text-[10px] font-normal opacity-80">
                    {!isPosttestUnlocked 
                      ? "Selesaikan Modul Terlebih Dahulu" 
                      : skorPosttest !== null 
                      ? `Skor: ${skorPosttest} Poin` 
                      : "Siap dikerjakan"}
                  </p>
                </div>
              </div>
              {!isPosttestUnlocked ? <Lock className="w-3.5 h-3.5" /> : <ChevronRight className="w-4 h-4 opacity-70" />}
            </button>
          </nav>

          {/* Status Ringkasan Enrollments */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Status Pembelajaran di Firestore:</p>
            <p>Pretest: <span className="font-bold text-bpsdm-blue">{skorPretest !== null ? `${skorPretest} Poin` : "Belum Ada"}</span></p>
            <p>Modul: <span className="font-bold text-slate-800">{modulSelesai ? "Selesai Dipelajari" : "Belum Selesai"}</span></p>
            <p>Posttest: <span className="font-bold text-jayaraya-orange">{skorPosttest !== null ? `${skorPosttest} Poin` : "Terkunci"}</span></p>
          </div>
        </aside>

        {/* 75% KOLOM KANAN: Area Kerja, PDF Viewer, atau Kuis */}
        <main className="w-full md:w-3/4 p-6 sm:p-8 flex flex-col bg-slate-50 min-h-[600px]">
          {/* PANEL: PRETEST */}
          {activeStep === "pretest" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col">
              <div className="border-b pb-4 mb-6">
                <span className="text-xs font-bold text-bpsdm-blue uppercase bg-blue-50 px-2.5 py-1 rounded">
                  Tahap 1: Evaluasi Awal (Pretest)
                </span>
                <h3 className="text-xl font-bold text-slate-800 mt-2">
                  {pretestQuiz?.judul || "Pretest: Pemahaman Awal Peserta"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Jawab butir pertanyaan berikut untuk membuka akses ke materi modul PDF dan sesi Zoom. Hasil skor otomatis tersimpan di dokumen Firestore.
                </p>
              </div>

              {skorPretest !== null ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center my-auto">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-emerald-900">Pretest Berhasil Diselesaikan!</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    Skor Anda: <span className="font-extrabold text-2xl">{skorPretest}</span> / 100
                  </p>
                  <p className="text-xs text-emerald-600 mt-2">
                    Akses modul pembelajaran PDF dan tautan Zoom kini telah terbuka.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveStep("modul")}
                    className="mt-5 px-6 py-2.5 bg-bpsdm-blue hover:bg-bpsdm-blue-light text-white text-xs font-semibold rounded-lg shadow"
                  >
                    Lanjut ke Modul PDF
                  </button>
                </div>
              ) : (
                <div className="space-y-6 flex-1">
                  {(pretestQuiz?.questions || []).map((q, qIdx) => (
                    <div key={q.id || qIdx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="font-semibold text-slate-800 text-sm mb-3">
                        {qIdx + 1}. {q.pertanyaan}
                      </p>
                      <div className="space-y-2">
                        {q.pilihan.map((p, pIdx) => (
                          <label
                            key={pIdx}
                            className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                              userAnswers[qIdx] === pIdx
                                ? "bg-bpsdm-blue/10 border-bpsdm-blue text-bpsdm-blue font-medium"
                                : "bg-white border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`quiz-pre-${qIdx}`}
                              checked={userAnswers[qIdx] === pIdx}
                              onChange={() => handleAnswerSelect(qIdx, pIdx)}
                              className="text-bpsdm-blue focus:ring-bpsdm-blue"
                            />
                            <span>{p}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={isSubmittingQuiz || Object.keys(userAnswers).length < (pretestQuiz?.questions?.length || 1)}
                      onClick={() => handleSubmitQuiz("pretest")}
                      className="px-6 py-2.5 bg-bpsdm-blue hover:bg-bpsdm-blue-light text-white text-xs font-bold rounded-lg shadow disabled:opacity-50"
                    >
                      {isSubmittingQuiz ? "Menyimpan ke Firestore..." : "Kirim Jawaban Pretest"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PANEL: MODUL PDF DENGAN EMBEDDED VIEWER */}
          {activeStep === "modul" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeModule?.judul || "Materi Modul Ajar"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pelajari bahan ajar resmi melalui PDF Viewer bawaan di bawah ini.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMarkModuleComplete}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      modulSelesai
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-bpsdm-gold hover:bg-bpsdm-gold-dark text-bpsdm-blue-dark"
                    }`}
                  >
                    {modulSelesai ? "✓ Modul Selesai Dipelajari" : "Tandai Modul Selesai"}
                  </button>
                </div>
              </div>

              {/* Selector Modul jika lebih dari 1 */}
              {(course.modules?.length || 0) > 1 && (
                <div className="flex border-b border-slate-200 bg-white px-4 py-2 gap-2 overflow-x-auto text-xs">
                  {course.modules.map((m, idx) => (
                    <button
                      key={m.id || idx}
                      onClick={() => setActiveModuleIndex(idx)}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                        activeModuleIndex === idx
                          ? "bg-bpsdm-blue text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {m.judul}
                    </button>
                  ))}
                </div>
              )}

              {/* Embedded PDF Viewer */}
              <div className="flex-1 bg-slate-200 min-h-[500px] flex flex-col items-center justify-center p-4">
                <iframe
                  src={`${activeModule?.pdfUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}#toolbar=1`}
                  className="w-full h-full min-h-[500px] rounded border border-slate-300 bg-white"
                  title="PDF Materi Pembelajaran"
                />
              </div>
            </div>
          )}

          {/* PANEL: SESI ZOOM */}
          {activeStep === "zoom" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col justify-center items-center text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Sesi Tatap Maya Interaktif (Zoom Meeting)
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-md">
                Sesi pemaparan materi langsung oleh Widyaiswara BPSDM Provinsi DKI Jakarta bersama seluruh peserta diklat.
              </p>

              <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left w-full space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Topik Pertemuan:</span>
                  <span className="font-semibold text-slate-800">{zoomSession?.topik || "Sesi Sinkronus Pembekalan Materi"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Pelaksanaan:</span>
                  <span className="font-semibold text-slate-800">{zoomSession?.jadwal || "Senin, 09:00 - 11:30 WIB"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tautan Masuk:</span>
                  <span className="font-mono text-bpsdm-blue break-all">{zoomSession?.joinUrl || "https://zoom.us"}</span>
                </div>
              </div>

              <a
                href={zoomSession?.joinUrl || "https://zoom.us"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg text-xs transition-colors shadow"
              >
                <ExternalLink className="w-4 h-4" />
                Buka Aplikasi Zoom & Gabung Kelas
              </a>
            </div>
          )}

          {/* PANEL: POSTTEST */}
          {activeStep === "posttest" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col">
              <div className="border-b pb-4 mb-6">
                <span className="text-xs font-bold text-jayaraya-orange uppercase bg-orange-50 px-2.5 py-1 rounded">
                  Tahap Terakhir: Uji Kompetensi
                </span>
                <h3 className="text-xl font-bold text-slate-800 mt-2">
                  {posttestQuiz?.judul || "Posttest: Evaluasi Pemahaman Materi"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kerjakan posttest secara teliti untuk menentukan kelulusan Anda pada program diklat ini. Nilai akhir akan disimpan ke Firestore.
                </p>
              </div>

              <div className="space-y-6 flex-1">
                {(posttestQuiz?.questions || []).map((q, qIdx) => (
                  <div key={q.id || qIdx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-semibold text-slate-800 text-sm mb-3">
                      {qIdx + 1}. {q.pertanyaan}
                    </p>
                    <div className="space-y-2">
                      {q.pilihan.map((p, pIdx) => (
                        <label
                          key={pIdx}
                          className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            userAnswers[qIdx] === pIdx
                              ? "bg-bpsdm-blue/10 border-bpsdm-blue text-bpsdm-blue font-medium"
                              : "bg-white border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-post-${qIdx}`}
                            checked={userAnswers[qIdx] === pIdx}
                            onChange={() => handleAnswerSelect(qIdx, pIdx)}
                            className="text-bpsdm-blue focus:ring-bpsdm-blue"
                          />
                          <span>{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={isSubmittingQuiz || Object.keys(userAnswers).length < (posttestQuiz?.questions?.length || 1)}
                    onClick={() => handleSubmitQuiz("posttest")}
                    className="px-6 py-2.5 bg-jayaraya-orange hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow disabled:opacity-50"
                  >
                    {isSubmittingQuiz ? "Menghitung & Menyimpan ke Firestore..." : "Kirim Jawaban Posttest"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PANEL: SELESAI & HASIL LULUS */}
          {activeStep === "selesai" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col justify-center items-center text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-bpsdm-gold/20 text-bpsdm-gold-dark flex items-center justify-center mb-4">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                Selamat, Anda Telah Menyelesaikan Diklat!
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Seluruh tahapan mulai dari Pretest, Modul Ajar, Sesi Tatap Maya, hingga Posttest telah berhasil direkam ke dalam database Firestore.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full my-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500">Skor Pretest</p>
                  <p className="text-2xl font-black text-bpsdm-blue">{skorPretest}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500">Skor Posttest</p>
                  <p className="text-2xl font-black text-jayaraya-orange">{skorPosttest}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Sertifikat digital atas nama ${enrollment?.userName} telah diterbitkan dan tersimpan di database.`)}
                className="w-full py-3 bg-bpsdm-blue hover:bg-bpsdm-blue-light text-white text-xs font-bold rounded-lg shadow"
              >
                Unduh Sertifikat Digital (PDF)
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

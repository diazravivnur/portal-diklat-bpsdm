import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course, Enrollment, UserProfile } from "@/types";

const COURSES_COL = "courses";
const ENROLLMENTS_COL = "enrollments";
const USERS_COL = "users";

// ==========================================
// COURSE REPOSITORY
// ==========================================

export async function getAllCourses(): Promise<Course[]> {
  try {
    const coursesRef = collection(db, COURSES_COL);
    const q = query(coursesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Course));
  } catch (error) {
    console.error("Error fetching all courses from Firestore:", error);
    // Fallback if index isn't created or collection empty
    try {
      const coursesRef = collection(db, COURSES_COL);
      const snapshot = await getDocs(coursesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Course));
    } catch (fallbackError) {
      console.error("Fallback error fetching courses:", fallbackError);
      return [];
    }
  }
}

export async function getCourseById(courseId: string): Promise<Course | null> {
  try {
    const docRef = doc(db, COURSES_COL, courseId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Course;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    return null;
  }
}

export async function createCourse(courseData: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const coursesRef = collection(db, COURSES_COL);
  const docRef = await addDoc(coursesRef, {
    ...courseData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateCourse(courseId: string, courseData: Partial<Course>): Promise<void> {
  const docRef = doc(db, COURSES_COL, courseId);
  await updateDoc(docRef, {
    ...courseData,
    updatedAt: serverTimestamp()
  });
}

export async function deleteCourse(courseId: string): Promise<void> {
  const docRef = doc(db, COURSES_COL, courseId);
  await deleteDoc(docRef);
}

// ==========================================
// ENROLLMENT & SEQUENTIAL PROGRESS REPOSITORY
// ==========================================

export async function getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
  try {
    const enrollmentsRef = collection(db, ENROLLMENTS_COL);
    const q = query(
      enrollmentsRef,
      where("userId", "==", userId),
      where("courseId", "==", courseId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }
    const docItem = snapshot.docs[0];
    return {
      id: docItem.id,
      ...docItem.data()
    } as Enrollment;
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return null;
  }
}

export async function getOrCreateEnrollment(
  userId: string, 
  courseId: string,
  extra?: { userName?: string; courseTitle?: string }
): Promise<Enrollment> {
  const existing = await getEnrollment(userId, courseId);
  if (existing) {
    return existing;
  }

  // Buat enrollment baru jika belum terdaftar
  const enrollmentsRef = collection(db, ENROLLMENTS_COL);
  const newEnrollment: Omit<Enrollment, "id"> = {
    userId,
    courseId,
    userName: extra?.userName || "Peserta ASN",
    courseTitle: extra?.courseTitle || "",
    statusProgress: "belum_mulai",
    skorPretest: null,
    skorPosttest: null,
    modulSelesai: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(enrollmentsRef, newEnrollment);
  return {
    id: docRef.id,
    ...newEnrollment
  };
}

export async function updateEnrollmentProgress(
  enrollmentId: string,
  updates: Partial<Enrollment>
): Promise<void> {
  const docRef = doc(db, ENROLLMENTS_COL, enrollmentId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

// ==========================================
// SEED INITIAL COURSE DATA
// ==========================================

export async function seedSampleCoursesIfEmpty(): Promise<boolean> {
  try {
    const existing = await getAllCourses();
    if (existing.length > 0) {
      return false; // Already has data
    }

    const sampleCourse: Omit<Course, "id" | "createdAt" | "updatedAt"> = {
      judul: "Pengelolaan Pengetahuan (Knowledge Management) Instansi Pemerintah",
      deskripsi: "Membangun budaya berbagi pengetahuan (knowledge sharing) serta digitalisasi tacit knowledge menjadi aset strategis Pemprov DKI Jakarta.",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
      kategori: "Kompetensi Manajerial",
      durasi: "32 JP",
      modules: [
        {
          id: "mod-1",
          judul: "Modul 1: Konsep Dasar Knowledge Management di Pemprov DKI Jakarta",
          pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          urutan: 1
        },
        {
          id: "mod-2",
          judul: "Modul 2: Transformasi Tacit ke Explicit Knowledge ASN",
          pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          urutan: 2
        }
      ],
      zoomMeetings: [
        {
          id: "zoom-1",
          topik: "Sesi Bedah Kasus & Tatap Maya Knowledge Management",
          joinUrl: "https://zoom.us",
          jadwal: "Senin, 09:00 - 11:30 WIB"
        }
      ],
      quizzes: {
        pretest: {
          tipe: "pretest",
          judul: "Pretest: Pemahaman Awal Knowledge Management ASN",
          durasiMenit: 30,
          questions: [
            {
              id: "q-1",
              pertanyaan: "Apa tujuan utama implementasi Knowledge Management pada organisasi publik BPSDM DKI Jakarta?",
              pilihan: [
                "Mencegah knowledge loss akibat rotasi atau pensiun pegawai",
                "Menghilangkan fungsi perpustakaan konvensional",
                "Membuat laporan kegiatan menjadi formalitas",
                "Mengganti tugas pejabat struktural secara otomatis"
              ],
              kunciJawaban: 0,
              bobot: 50
            },
            {
              id: "q-2",
              pertanyaan: "Metode apa yang paling efektif untuk mentransfer 'Tacit Knowledge' ke 'Explicit Knowledge'?",
              pilihan: [
                "Pemberian sanksi administratif",
                "Dokumentasi praktik baik (Community of Practice) dan SOP digital",
                "Menyimpan catatan pada buku harian pribadi",
                "Mengunci informasi agar tidak dapat diakses orang lain"
              ],
              kunciJawaban: 1,
              bobot: 50
            }
          ]
        },
        posttest: {
          tipe: "posttest",
          judul: "Posttest: Evaluasi Akhir Pemahaman Knowledge Management",
          durasiMenit: 45,
          questions: [
            {
              id: "q-post-1",
              pertanyaan: "Komponen kunci dalam keberhasilan budaya Knowledge Sharing ASN adalah...",
              pilihan: [
                "Keterbukaan informasi dan kolaborasi lintas OPD",
                "Pembatasan akses dokumen hanya untuk pimpinan",
                "Pencetakan dokumen dalam jumlah berlebih",
                "Menghindari evaluasi berkala"
              ],
              kunciJawaban: 0,
              bobot: 50
            },
            {
              id: "q-post-2",
              pertanyaan: "Contoh konkret output Explicit Knowledge yang dihasilkan dari diklat ini adalah...",
              pilihan: [
                "Opini lisan tanpa dokumentasi",
                "Repository digital SOP, Best Practice Guideline, dan Video Microlearning",
                "Buku agenda rapat yang disimpan di laci",
                "Notulensi yang tidak dipublikasikan"
              ],
              kunciJawaban: 1,
              bobot: 50
            }
          ]
        }
      }
    };

    await createCourse(sampleCourse);
    return true;
  } catch (error) {
    console.error("Error seeding initial course:", error);
    return false;
  }
}


// ==========================================
// SESSION MANAGEMENT (MOCK AUTH)
// ==========================================

export function getSessionUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const data = sessionStorage.getItem("peserta_user");
  if (!data) return null;
  try {
    return JSON.parse(data) as UserProfile;
  } catch {
    return null;
  }
}

export function setSessionUser(user: UserProfile): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("peserta_user", JSON.stringify(user));
}

export function clearSessionUser(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("peserta_user");
}

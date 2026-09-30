export interface UserProfile {
  uid?: string;
  username: string;
  nip: string;
  email: string;
  role: 'admin' | 'peserta';
  password?: string;
  createdAt?: any;
}

export interface ModuleItem {
  id: string;
  judul: string;
  pdfUrl: string;
  urutan: number;
}

export interface ZoomMeeting {
  id: string;
  topik: string;
  joinUrl: string;
  jadwal: string; // ISO String or datetime format
}

export interface QuestionItem {
  id: string;
  pertanyaan: string;
  pilihan: string[];
  kunciJawaban: number; // Index 0..3
  bobot: number;
}

export interface Quiz {
  id?: string;
  tipe: 'pretest' | 'posttest';
  judul: string;
  durasiMenit?: number;
  questions: QuestionItem[];
}

export interface Course {
  id?: string;
  judul: string;
  deskripsi: string;
  thumbnail: string;
  kategori?: string;
  durasi?: string;
  modules: ModuleItem[];
  zoomMeetings: ZoomMeeting[];
  quizzes: {
    pretest: Quiz;
    posttest: Quiz;
  };
  createdAt?: any;
  updatedAt?: any;
}

export interface Enrollment {
  id?: string;
  userId: string;
  courseId: string;
  userName?: string;
  courseTitle?: string;
  statusProgress: 'belum_mulai' | 'pretest_selesai' | 'modul_selesai' | 'lulus';
  skorPretest?: number | null;
  skorPosttest?: number | null;
  modulSelesai: boolean;
  createdAt?: any;
  updatedAt?: any;
}

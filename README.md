# PORTAL DIKLAT KNOWLEDGE MANAGEMENT BPSDM PROVINSI DKI JAKARTA

Kerangka kerja (*scaffolding*) aplikasi web fullstack e-learning dan knowledge management aparatur pemerintah Provinsi DKI Jakarta berbasis Next.js (App Router), Tailwind CSS, dan Firebase.

---

## 🎨 Palet Warna Identitas
- **BPSDM Navy Blue (Primer):** `#0F2C59`
- **Jaya Raya Orange / Emas (Sekunder):** `#FF6B00` & `#F59E0B`

---

## 🗂️ Struktur Direktori Proyek

```text
portal-diklat-bpsdm/
├── public/                     # Aset statis & logo instansi
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Layout & Halaman Admin
│   │   │   ├── layout.tsx      # Sidebar Navigasi Kiri + Dynamic Content Kanan
│   │   │   └── page.tsx        # Formulir Diklat dengan Sistem Tabs
│   │   ├── peserta/            # Layout & Halaman Peserta
│   │   │   ├── course/
│   │   │   │   └── [id]/page.tsx # Ruang Kelas (Learning Room 2 Kolom: 25% / 75%)
│   │   │   ├── layout.tsx      # Header Peserta
│   │   │   └── page.tsx        # Grid Katalog Diklat
│   │   ├── globals.css         # Styling Tailwind & CSS Variables
│   │   ├── layout.tsx          # Root Layout + Static Footer
│   │   └── page.tsx            # Portal Gateway Pemilihan Peran
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx       # Sidebar: Beranda, Kelola Diklat, Kelola Peserta, Laporan
│   │   │   └── CourseCreationForm.tsx # Form Tabs (Umum, Modul PDF, Sesi Zoom, Evaluasi Kuis)
│   │   ├── common/
│   │   │   └── StaticFooter.tsx       # "Created by Dr. Ima Rohimah, M.Pd."
│   │   └── peserta/
│   │       ├── LearningRoom.tsx       # Logika Sekuensial & Evaluasi Kuis
│   │       └── PesertaHeader.tsx      # Header & Identitas Peserta
│   ├── lib/
│   │   └── firebase.ts         # Inisialisasi Firebase Auth, Firestore, Storage
│   └── types/
│       └── index.ts            # Skema Tipe Firestore NoSQL
├── .env.example
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 💾 Skema Database (Cloud Firestore NoSQL)

1. **`users`**: Data akun pengguna
   - `uid`, `nama`, `nip`, `email`, `role: 'admin' | 'peserta'`
2. **`courses`**: Metadata program diklat
   - `id`, `judul`, `deskripsi`, `thumbnail`, `createdAt`
   - *Sub-collection* `modules`: `judul`, `pdfUrl`, `urutan`
   - *Sub-collection* `zoom_meetings`: `topik`, `joinUrl`, `jadwal`
   - *Sub-collection* `quizzes`: `tipe: 'pretest' | 'posttest'`, `judul`
   - *Sub-collection* `questions`: `pertanyaan`, `pilihan[]`, `kunciJawaban`, `bobot`
3. **`enrollments`**: Pelacakan progres peserta (tabel pivot)
   - `userId`, `courseId`, `statusProgress`, `skorPretest`, `skorPosttest`, `modulSelesai`

---

## 🔒 Logika Bisnis Pembelajaran Sekuensial (Peserta)

1. **Pretest:** Wajib diselesaikan pertama kali. Skor dihitung otomatis dari bobot soal benar dan disimpan ke `enrollments`.
2. **Modul PDF & Zoom:** Terkunci (ikon gembok) jika `skorPretest` belum tersimpan di Firestore.
3. **Posttest:** Terkunci sampai peserta selesai membaca materi dan mengonfirmasi "Tandai Modul Selesai" (`modulSelesai === true`).

---

## 🚀 Panduan Memulai (*Quickstart*)

```bash
cd portal-diklat-bpsdm
npm install
npm run dev
```

Buka peramban di `http://localhost:3000`.

---
*Created by Dr. Ima Rohimah, M.Pd.*

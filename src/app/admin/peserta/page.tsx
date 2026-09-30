"use client";

import { useEffect, useState } from "react";
import { Trash2, Users, Plus } from "lucide-react";
import { getAllUsers, createUser, deleteUser } from "@/lib/firestoreService";
import { UserProfile } from "@/types";

export default function AdminPesertaPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [username, setusername] = useState("");
  const [nip, setNip] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !nip) {
      alert("username dan NIP/NRK harus diisi!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createUser({
        username,
        nip,
        email: email || `${nip}@jakarta.go.id`,
        role: "peserta",
        password: "password"
      });
      alert("Peserta berhasil ditambahkan!");
      setusername("");
      setNip("");
      setEmail("");
      setIsFormOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Gagal menambah peserta", error);
      alert("Gagal menambahkan peserta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus peserta ini?")) return;
    try {
      await deleteUser(uid);
      fetchUsers();
    } catch (error) {
      console.error("Gagal menghapus", error);
      alert("Gagal menghapus peserta");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Kelola Peserta
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftar ASN yang terdaftar sebagai peserta diklat.
          </p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-2 bg-bpsdm-blue hover:bg-bpsdm-blue-light text-white font-semibold px-4 py-2.5 rounded-lg shadow transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Peserta
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Tambah Peserta Baru</h2>
          <form onSubmit={handleCreate} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">username Lengkap</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bpsdm-blue/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">NIP / NRK</label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Contoh: 198001012005011001"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bpsdm-blue/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email (Opsional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@jakarta.go.id"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-bpsdm-blue/50 text-sm"
              />
            </div>
            <p className="text-xs text-amber-600 font-medium">Catatan: Password secara default akan diatur menjadi "password".</p>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-bpsdm-blue hover:bg-bpsdm-blue-light text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Peserta"}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-2 rounded-lg transition-colors text-sm"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Memuat data...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            Belum ada peserta yang terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">username Peserta</th>
                  <th className="px-6 py-4">NIP / NRK</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {user.username}
                    </td>
                    <td className="px-6 py-4">{user.nip}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => user.uid && handleDelete(user.uid)}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        title="Hapus Peserta"
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


'use client';
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAllUsers, createUser, setSessionUser } from "@/lib/firestoreService";
import { UserProfile } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
// Ensure default users exist by calling seed endpoint
  useEffect(() => {
    fetch('/api/seed').catch(console.error);
  }, []);


  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const users = await getAllUsers();
      // Hardcoded credentials fallback
      let found: UserProfile | undefined;
      if (nip === '197206101999032008' && password === 'password') {
        found = { uid: 'admin', username: 'Dr. Ima Rohimah, M.Pd.', nip, email: 'admin@example.com', role: 'admin' } as UserProfile;
      } else if (nip === '223043' && password === 'password') {
        found = { uid: 'peserta', username: 'Diaz Raviv Nur', nip, email: 'peserta@example.com', role: 'peserta' } as UserProfile;
      }
      if (!found) {
        setError("Invalid NIP/NRK or password");
        return;
      }
      const session: UserProfile = {
        uid: found.uid,
        username: found.username,
        nip: found.nip,
        email: found.email,
        role: found.role,
      };
      setSessionUser(session);
      if (found.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/peserta");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80 flex flex-col items-center">
        <Image src="/logos/bpsdm.png" alt="BPSDM" width={80} height={80} className="mb-4" />
        <h2 className="text-2xl mb-4 text-center font-semibold">Login Portal Diklat</h2>
        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">NIP / NRK</label>
          <input
            type="text"
            value={nip}
            onChange={e => setNip(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        {error && <p className="text-red-600 mb-2 w-full text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-bpsdm-blue text-white py-2 rounded hover:bg-bpsdm-blue-dark transition"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}


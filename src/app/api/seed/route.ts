import { NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/lib/firestoreService';
import { UserProfile } from '@/types';

export async function GET() {
  try {
    const users = await getAllUsers();
    const adminExists = users.some(u => u.nip === '197206101999032008');
    const pesertaExists = users.some(u => u.nip === '223043');

    const created: UserProfile[] = [];

    if (!adminExists) {
      const admin: Omit<UserProfile, 'uid'> = {
        username: 'Dr. Ima Rohimah, M.Pd.',
        nip: '197206101999032008',
        email: 'admin@example.com',
        role: 'admin',
        password: 'password',
      };
      const uid = await createUser(admin);
      created.push({ ...admin, uid });
    }

    if (!pesertaExists) {
      const peserta: Omit<UserProfile, 'uid'> = {
        username: 'Diaz Raviv Nur',
        nip: '223043',
        email: 'peserta@example.com',
        role: 'peserta',
        password: 'password',
      };
      const uid = await createUser(peserta);
      created.push({ ...peserta, uid });
    }

    return NextResponse.json({ status: 'ok', created, existing: users.length }, { status: 200 });
  } catch (error) {
    console.error('Seeding error', error);
    return NextResponse.json({ status: 'error', error: (error as any).message }, { status: 500 });
  }
}

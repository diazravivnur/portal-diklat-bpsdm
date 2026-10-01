import { NextResponse } from 'next/server';

/**
 * Debug endpoint for users.
 * Returns a simple JSON payload. Extend this handler to query your database or other services.
 */
export async function GET() {
  // Example static data; replace with real logic as needed.
  const data = { status: 'ok', message: 'Debug users endpoint', timestamp: new Date().toISOString() };
  return NextResponse.json(data);
}


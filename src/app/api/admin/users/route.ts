import { NextResponse } from 'next/server';

export async function GET() {
  // Return mock data - Supabase not configured for build
  return NextResponse.json([
    { id: '1', wallet_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', email: 'sarah@example.com', role: 'user', kyc_status: 'approved', created_at: '2026-03-01' },
    { id: '2', wallet_address: '9aZKTtbDwUY4G7F6LrE3v4QmW2NpQr5sT8XwVyZzH2K', email: 'john@example.com', role: 'user', kyc_status: 'pending', created_at: '2026-03-05' },
    { id: '3', wallet_address: '3mBnK9hL7YvWqOp2RtU5xZmC1JdFg8TsE6YuUzP3WXL', email: 'mike@example.com', role: 'admin', kyc_status: 'approved', created_at: '2026-03-10' },
  ]);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Return mock success - Supabase not configured for build
  return NextResponse.json({ 
    id: Date.now().toString(),
    ...body,
    created_at: new Date().toISOString()
  });
}

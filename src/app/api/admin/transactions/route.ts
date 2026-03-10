import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: '1', user_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', type: 'participation', amount_sol: 2.5, status: 'confirmed', tx_signature: 'abc123', created_at: '2026-03-10T10:30:00Z' },
    { id: '2', user_address: '9aZKTtbDwUY4G7F6LrE3v4QmW2NpQr5sT8XwVyZzH2K', type: 'claim', amount_sol: 1500, status: 'confirmed', tx_signature: 'def456', created_at: '2026-03-10T09:15:00Z' },
  ]);
}

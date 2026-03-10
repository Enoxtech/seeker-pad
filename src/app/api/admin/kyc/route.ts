import { NextResponse } from 'next/server';

const kycRequests = [
  { id: 1, wallet: '0x1234...5678', email: 'john@example.com', status: 'Verified', submittedAt: '2026-03-01', documents: 3 },
  { id: 2, wallet: '0xabcd...efgh', email: 'jane@example.com', status: 'Pending', submittedAt: '2026-03-05', documents: 3 },
  { id: 3, wallet: '0x9876...5432', email: 'bob@example.com', status: 'Rejected', submittedAt: '2026-02-28', documents: 2 },
  { id: 4, wallet: '0xdef0...1234', email: 'alice@example.com', status: 'Verified', submittedAt: '2026-03-02', documents: 3 },
];

export async function GET() {
  return NextResponse.json({ kycRequests, total: kycRequests.length });
}

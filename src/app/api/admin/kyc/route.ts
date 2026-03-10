import { NextResponse } from 'next/server';

const mockKYC = [
  { id: '1', wallet_address: '0x1234567890abcdef1234567890abcdef12345678', email: 'john@example.com', status: 'verified', document_type: 'Passport', submitted_at: '2026-03-01' },
  { id: '2', wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12', email: 'jane@example.com', status: 'pending', document_type: 'ID Card', submitted_at: '2026-03-05' },
  { id: '3', wallet_address: '0x9876543210fedcba9876543210fedcba98765432', email: 'bob@example.com', status: 'rejected', document_type: 'Driver License', submitted_at: '2026-02-28' },
];

export async function GET() {
  return NextResponse.json(mockKYC);
}

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: '1', type: 'email', title: 'New Launch Alert', status: 'sent', sent_at: '2026-03-10T10:00:00Z', recipients: { type: 'all' } },
    { id: '2', type: 'sms', title: 'KYC Approved', status: 'sent', sent_at: '2026-03-09T15:30:00Z', recipients: { type: 'wallets' } },
  ]);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    id: Date.now().toString(),
    type: body.type,
    title: body.title,
    status: 'sent',
    sent_at: new Date().toISOString()
  });
}

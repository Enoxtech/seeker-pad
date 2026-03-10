import { NextResponse } from 'next/server';

const mockNotifications = [
  { id: '1', type: 'email', title: 'New Launch Alert', recipients: '12,458', opened: 8420, clicked: 2340, status: 'sent', sent_at: '2026-03-10T10:00:00Z' },
  { id: '2', type: 'email', title: 'Launch Ending Soon', recipients: '892', opened: 756, clicked: 234, status: 'sent', sent_at: '2026-03-09T14:30:00Z' },
  { id: '3', type: 'sms', title: 'KYC Approved', recipients: '156', delivered: 154, status: 'sent', sent_at: '2026-03-09T10:00:00Z' },
  { id: '4', type: 'email', title: 'Token Claim Ready', recipients: '412', opened: 389, clicked: 156, status: 'sent', sent_at: '2026-03-08T16:00:00Z' },
  { id: '5', type: 'email', title: 'KYC Verification Required', recipients: '23', opened: 18, clicked: 12, status: 'sent', sent_at: '2026-03-08T09:00:00Z' },
  { id: '6', type: 'sms', title: 'Wallets Connected', recipients: '2,340', delivered: 2290, status: 'sent', sent_at: '2026-03-07T12:00:00Z' },
];

export async function GET() {
  return NextResponse.json(mockNotifications);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    id: Date.now().toString(),
    type: body.type,
    title: body.title,
    recipients: body.recipients,
    status: 'sent',
    sent_at: new Date().toISOString()
  });
}

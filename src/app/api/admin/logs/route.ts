import { NextResponse } from 'next/server';

const mockLogs = [
  { id: '1', admin_email: 'david.dao@outlook.com', action: 'Launch Created', details: 'Created "Solana Meme Lords" launch', ip_address: '192.168.1.100', created_at: '2026-03-10T10:30:45Z' },
  { id: '2', admin_email: 'david.dao@outlook.com', action: 'Launch Updated', details: 'Changed "Bonkify" status to Live', ip_address: '192.168.1.100', created_at: '2026-03-10T09:15:22Z' },
  { id: '3', admin_email: 'david.dao@outlook.com', action: 'KYC Approved', details: 'Approved KYC for 0x7xKX...AsU', ip_address: '192.168.1.100', created_at: '2026-03-09T16:45:10Z' },
  { id: '4', admin_email: 'david.dao@outlook.com', action: 'User Suspended', details: 'Suspended user 0x4dDg...XWR (fraud)', ip_address: '192.168.1.100', created_at: '2026-03-09T14:20:00Z' },
  { id: '5', admin_email: 'david.dao@outlook.com', action: 'Notification Sent', details: 'Sent "New Launch Alert" to 12,458 users', ip_address: '192.168.1.100', created_at: '2026-03-10T10:00:00Z' },
  { id: '6', admin_email: 'david.dao@outlook.com', action: 'Settings Changed', details: 'Updated platform fee to 3%', ip_address: '192.168.1.100', created_at: '2026-03-08T11:30:00Z' },
  { id: '7', admin_email: 'david.dao@outlook.com', action: 'KYC Rejected', details: 'Rejected KYC for 0x8dEf...4YK (invalid docs)', ip_address: '192.168.1.100', created_at: '2026-03-07T09:45:00Z' },
  { id: '8', admin_email: 'david.dao@outlook.com', action: 'Launch Created', details: 'Created "SeedVault Elite" (Elite)', ip_address: '192.168.1.100', created_at: '2026-03-06T15:00:00Z' },
];

export async function GET() {
  return NextResponse.json(mockLogs);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    id: Date.now().toString(),
    admin_email: body.adminEmail || 'admin@seekepad.com',
    action: body.action,
    details: body.details,
    ip_address: '192.168.1.100',
    created_at: new Date().toISOString()
  });
}

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: '1', admin_email: 'admin@seekepad.com', action: 'Launch Created', details: 'Created "Project Alpha" launch', ip_address: '192.168.1.1', created_at: '2026-03-10T10:30:45Z' },
    { id: '2', admin_email: 'admin@seekepad.com', action: 'User Suspended', details: 'Suspended user 0xdef0...1234', ip_address: '192.168.1.1', created_at: '2026-03-10T09:15:22Z' },
    { id: '3', admin_email: 'admin@seekepad.com', action: 'KYC Approved', details: 'Approved KYC for 0xabcd...efgh', ip_address: '192.168.1.1', created_at: '2026-03-09T16:45:10Z' },
  ]);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    id: Date.now().toString(),
    admin_email: body.adminEmail || 'admin@seekepad.com',
    action: body.action,
    details: body.details,
    ip_address: '192.168.1.1',
    created_at: new Date().toISOString()
  });
}

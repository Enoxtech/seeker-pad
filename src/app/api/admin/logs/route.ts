import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json([
      { id: '1', admin_email: 'admin@seekepad.com', action: 'Launch Created', details: { launch: 'Project Alpha' }, ip_address: '192.168.1.1', created_at: '2026-03-10T10:30:45Z' },
      { id: '2', admin_email: 'admin@seekepad.com', action: 'User Suspended', details: { user: '0xdef0...1234' }, ip_address: '192.168.1.1', created_at: '2026-03-10T09:15:22Z' },
      { id: '3', admin_email: 'admin@seekepad.com', action: 'KYC Approved', details: { user: '0xabcd...efgh' }, ip_address: '192.168.1.1', created_at: '2026-03-09T16:45:10Z' },
      { id: '4', admin_email: 'admin@seekepad.com', action: 'Settings Changed', details: { setting: 'platform_fee', old: '2%', new: '2.5%' }, ip_address: '192.168.1.1', created_at: '2026-03-09T14:20:33Z' },
      { id: '5', admin_email: 'admin@seekepad.com', action: 'Notification Sent', details: { title: 'New Launch' }, ip_address: '192.168.1.1', created_at: '2026-03-08T11:00:00Z' },
    ]);
  }
  
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ success: true });
  }
  
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([{
      admin_email: body.adminEmail || 'admin@seekepad.com',
      action: body.action,
      details: body.details,
      ip_address: body.ipAddress || '0.0.0.0',
    }])
    .select()
    .single();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

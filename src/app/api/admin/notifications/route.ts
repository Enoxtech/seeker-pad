import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json([
      { id: '1', type: 'email', title: 'New Launch Alert', status: 'sent', sent_at: '2026-03-10T10:00:00Z', recipients: { type: 'all' } },
      { id: '2', type: 'sms', title: 'KYC Approved', status: 'sent', sent_at: '2026-03-09T15:30:00Z', recipients: { type: 'wallets', addresses: [] } },
    ]);
  }
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }
  
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      type: body.type,
      title: body.title,
      message: body.message,
      recipients: body.recipients,
      status: 'sent',
      sent_at: new Date().toISOString(),
    }])
    .select()
    .single();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

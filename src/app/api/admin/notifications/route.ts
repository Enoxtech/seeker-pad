import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htkslwnrqcdjspdyuqhg.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3Nsd25ycWNkanNwZHl1cGgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0OTcwNiwiZXhwIjo5NTgxMjU3MDZ9.Vx5kORlLMLMdcVPBNT6-Tk9dJI6FbLHqQ0r6i3jC2E'
);

// Mock notifications data
const mockNotifications = [
  { id: '1', type: 'email', title: 'New Launch Alert', status: 'sent', sent_at: '2026-03-10T10:00:00Z', recipients: { type: 'all' } },
  { id: '2', type: 'wallet', title: 'Claim Your Tokens', status: 'sent', sent_at: '2026-03-09T14:00:00Z', recipients: { type: 'whitelist', addresses: ['7xKXtg2CW8YHZr2K3vLkLqGqXDhV3m'] } },
  { id: '3', type: 'email', title: 'KYC Verification Required', status: 'sent', sent_at: '2026-03-08T09:00:00Z', recipients: { type: 'all' } },
];

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(data || mockNotifications);
  } catch (error) {
    console.error('Error fetching notifications, using mock data:', error);
    return NextResponse.json(mockNotifications);
  }
}

export async function POST(request: Request) {
  let body = {};
  try {
    body = await request.json();
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ ...body, read: false }])
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating notification, using mock response:', error);
    return NextResponse.json({ id: Date.now().toString(), ...body, status: 'sent', sent_at: new Date().toISOString() });
  }
}
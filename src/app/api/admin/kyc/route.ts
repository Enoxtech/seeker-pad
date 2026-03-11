import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htkslwnrqcdjspdyuqhg.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3Nsd25ycWNkanNwZHl1cGgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0OTcwNiwiZXhwIjo5NTgxMjU3MDZ9.Vx5kORlLMLMdcVPBNT6-Tk9dJI6FbLHqQ0r6i3jC2E'
);

// Mock data
const mockKYC = [
  { id: '1', user_id: 'user1', status: 'verified', submitted_at: '2026-03-01', verified_at: '2026-03-02' },
  { id: '2', user_id: 'user2', status: 'verified', submitted_at: '2026-03-02', verified_at: '2026-03-03' },
  { id: '3', user_id: 'user3', status: 'pending', submitted_at: '2026-03-05', verified_at: null },
];

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('kyc')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(data || mockKYC);
  } catch (error) {
    console.error('Error fetching KYC, using mock data:', error);
    return NextResponse.json(mockKYC);
  }
}
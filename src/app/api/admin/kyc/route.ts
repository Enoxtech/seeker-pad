import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Mock KYC data
const mockKYC = [
  { id: '1', wallet_address: '7xKXtg2CW8YHZr2K3vLkLqGqXDhV3m', email: 'user1@example.com', status: 'approved', document_type: 'passport', submitted_at: '2026-03-01' },
  { id: '2', wallet_address: '9aZKTtbD7mBnK9hL5nCpQ8rT', email: 'user2@example.com', status: 'approved', document_type: 'national_id', submitted_at: '2026-03-02' },
  { id: '3', wallet_address: '3mBnK9hL5nCpQ8rT9aZKXy', email: 'user3@example.com', status: 'pending', document_type: 'drivers_license', submitted_at: '2026-03-05' },
];

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(mockKYC);
    }
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
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Mock data
const mockUsers = [
  { id: '1', wallet_address: '7xKXtg2CW8YHZr2K3vLkLqGqXDhV3m', email: 'user1@example.com', kyc_status: 'verified', created_at: '2026-03-01' },
  { id: '2', wallet_address: '9aZKTtbD7mBnK9hL5nCpQ8rT', email: 'user2@example.com', kyc_status: 'verified', created_at: '2026-03-02' },
  { id: '3', wallet_address: '3mBnK9hL5nCpQ8rT9aZKXy', email: 'user3@example.com', kyc_status: 'pending', created_at: '2026-03-05' },
];

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(mockUsers);
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json(data || mockUsers);
  } catch (error) {
    console.error('Error fetching users, using mock data:', error);
    return NextResponse.json(mockUsers);
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  let body = {};
  try {
    body = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ id: Date.now().toString(), ...body, kyc_status: 'pending', created_at: new Date().toISOString() });
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ ...body, kyc_status: 'pending' }])
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating user, using mock response:', error);
    return NextResponse.json({ id: Date.now().toString(), ...body, kyc_status: 'pending', created_at: new Date().toISOString() });
  }
}
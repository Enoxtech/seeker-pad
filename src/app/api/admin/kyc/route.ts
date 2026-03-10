import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const mockKYC = [
  { id: '1', wallet_address: '0x1234...5678', email: 'john@example.com', status: 'verified', submitted_at: '2026-03-01', documents_count: 3 },
  { id: '2', wallet_address: '0xabcd...efgh', email: 'jane@example.com', status: 'pending', submitted_at: '2026-03-05', documents_count: 3 },
  { id: '3', wallet_address: '0x9876...5432', email: 'bob@example.com', status: 'rejected', submitted_at: '2026-02-28', documents_count: 2 },
];

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('kyc_requests')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      
      return NextResponse.json({ kycRequests: data || [], total: data?.length || 0 });
    }
    
    return NextResponse.json({ kycRequests: mockKYC, total: mockKYC.length });
    
  } catch (error) {
    console.error('Error fetching KYC:', error);
    return NextResponse.json({ error: 'Failed to fetch KYC requests' }, { status: 500 });
  }
}

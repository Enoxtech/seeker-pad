import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const supabase = getSupabase();
  if (!supabase) {
    // Return mock data when Supabase not configured
    return NextResponse.json({ id, wallet_address: 'mock_wallet', status: 'pending', created_at: new Date().toISOString() });
  }
  
  try {
    const { data, error } = await supabase
      .from('kyc')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching KYC:', error);
    return NextResponse.json({ error: 'Failed to fetch KYC' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }
  
  try {
    const body = await request.json();
    const updateData: any = { status: body.status };
    
    if (body.status === 'verified') {
      updateData.verified_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('kyc')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating KYC:', error);
    return NextResponse.json({ error: 'Failed to update KYC' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('kyc_requests')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching KYC:', error);
    return NextResponse.json({ error: 'Failed to fetch KYC requests' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, action } = await request.json();
    
    const newStatus = action === 'approve' ? 'verified' : 'rejected';
    
    const { data, error } = await supabase
      .from('kyc_requests')
      .update({ status: newStatus })
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

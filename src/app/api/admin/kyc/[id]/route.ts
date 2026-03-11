import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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
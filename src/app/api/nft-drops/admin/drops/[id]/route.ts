import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://htkslwnrqcdjspdyuqhg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// PUT /api/nft-drops/admin/drops/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { id } = params;
    const { 
      name, description, image_url, contract_address, candy_machine_id,
      start_date, end_date, supply_limit, mint_price, is_active
    } = body;

    const { data, error } = await supabase
      .from('nft_drops')
      .update({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(image_url && { image_url }),
        ...(contract_address && { contract_address }),
        ...(candy_machine_id && { candy_machine_id }),
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
        ...(supply_limit !== undefined && { supply_limit }),
        ...(mint_price !== undefined && { mint_price }),
        ...(is_active !== undefined && { is_active }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating NFT drop:', error);
    return NextResponse.json({ error: 'Failed to update NFT drop' }, { status: 500 });
  }
}

// DELETE /api/nft-drops/admin/drops/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const { error } = await supabase
      .from('nft_drops')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting NFT drop:', error);
    return NextResponse.json({ error: 'Failed to delete NFT drop' }, { status: 500 });
  }
}
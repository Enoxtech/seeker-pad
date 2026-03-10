import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  
  // For now, return success - Supabase not configured
  // In production, this would update the database
  return NextResponse.json({ 
    id: params.id, 
    status: body.status,
    reviewed_at: new Date().toISOString()
  });
}

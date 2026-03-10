import { NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

// Mock data fallback when Supabase not configured
const mockUsers = [
  { id: '1', wallet_address: '0x1234...5678', email: 'john@example.com', role: 'user', kyc_status: 'verified', created_at: '2026-02-15' },
  { id: '2', wallet_address: '0xabcd...efgh', email: 'jane@example.com', role: 'user', kyc_status: 'pending', created_at: '2026-02-20' },
  { id: '3', wallet_address: '0x9876...5432', email: 'bob@example.com', role: 'admin', kyc_status: 'verified', created_at: '2026-01-10' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'all';
  const search = searchParams.get('search') || '';
  
  try {
    // Use Supabase if configured
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      let query = supabase!.from('users').select('*');
      
      if (status !== 'all') {
        query = query.eq('kyc_status', status);
      }
      
      if (search) {
        query = query.or(`wallet_address.ilike.%${search}%,email.ilike.%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ users: data || [], total: data?.length || 0 });
    }
    
    // Fallback to mock data
    let filtered = mockUsers;
    if (status !== 'all') {
      filtered = filtered.filter(u => u.kyc_status === status);
    }
    if (search) {
      filtered = filtered.filter(u => 
        u.wallet_address.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return NextResponse.json({ users: filtered, total: filtered.length });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Input validation
    if (!body.wallet_address || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      const { data, error } = await supabase!
        .from('users')
        .insert({
          wallet_address: body.wallet_address,
          email: body.email,
          role: body.role || 'user',
          kyc_status: body.kyc_status || 'none',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ success: true, user: data });
    }
    
    // Mock fallback
    const newUser = {
      id: String(mockUsers.length + 1),
      ...body,
      created_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    
    return NextResponse.json({ success: true, user: newUser });
    
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

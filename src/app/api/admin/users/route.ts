import { NextResponse } from 'next/server';

// Mock data for now - can connect to Supabase later
const users = [
  { id: 1, wallet: '0x1234...5678', email: 'john@example.com', role: 'User', kyc: 'Verified', joined: '2026-02-15', participation: '2500', status: 'Active' },
  { id: 2, wallet: '0xabcd...efgh', email: 'jane@example.com', role: 'User', kyc: 'Pending', joined: '2026-02-20', participation: '500', status: 'Active' },
  { id: 3, wallet: '0x9876...5432', email: 'bob@example.com', role: 'Admin', kyc: 'Verified', joined: '2026-01-10', participation: '0', status: 'Active' },
  { id: 4, wallet: '0xdef0...1234', email: 'alice@example.com', role: 'User', kyc: 'Rejected', joined: '2026-02-25', participation: '0', status: 'Suspended' },
  { id: 5, wallet: '0x5678...90ab', email: 'charlie@example.com', role: 'User', kyc: 'Verified', joined: '2026-03-01', participation: '1000', status: 'Active' },
  { id: 6, wallet: '0x2468...1357', email: 'david@example.com', role: 'User', kyc: 'Verified', joined: '2026-03-05', participation: '750', status: 'Active' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('status') || 'All';
  const search = searchParams.get('search') || '';
  
  let filtered = users;
  
  if (filter !== 'All') {
    filtered = filtered.filter(u => u.status === filter);
  }
  
  if (search) {
    filtered = filtered.filter(u => 
      u.wallet.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  return NextResponse.json({ users: filtered, total: filtered.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newUser = {
    id: users.length + 1,
    ...body,
    joined: new Date().toISOString().split('T')[0],
    participation: 0,
    status: 'Active',
  };
  
  users.push(newUser);
  
  return NextResponse.json({ success: true, user: newUser });
}

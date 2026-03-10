import { NextResponse } from 'next/server';

const mockUsers = [
  { id: '1', wallet_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', email: 'sarah.miller@gmail.com', username: 'sarah_m', role: 'user', kyc_status: 'verified', total_contributed: 12.5, launches_participated: 3, created_at: '2026-01-15T10:30:00Z' },
  { id: '2', wallet_address: '9aZKTtbDwUY4G7F6LrE3v4QmW2NpQr5sT8XwVyZzH2K', email: 'john.crypto@yahoo.com', username: 'johndefi', role: 'user', kyc_status: 'verified', total_contributed: 45.2, launches_participated: 7, created_at: '2026-01-20T14:45:00Z' },
  { id: '3', wallet_address: '3mBnK9hL7YvWqOp2RtU5xZmC1JdFg8TsE6YuUzP3WXL', email: 'mike.nft@outlook.com', username: 'mikenft', role: 'user', kyc_status: 'verified', total_contributed: 28.75, launches_participated: 5, created_at: '2026-02-01T09:15:00Z' },
  { id: '4', wallet_address: '5nCpLQ9hL7YvWqOp2RtU5xZmC1JdFg8TsE6YuUzP3WXM', email: 'emma.sol@proton.me', username: 'emmasol', role: 'user', kyc_status: 'pending', total_contributed: 0, launches_participated: 0, created_at: '2026-03-05T16:20:00Z' },
  { id: '5', wallet_address: '8dEfG0iM8ZwXrPq3SuV6yAnB2NkOwR9TlAxBuCzJ4YK', email: 'alex.trader@gmail.com', username: 'alextrader', role: 'user', kyc_status: 'verified', total_contributed: 156.8, launches_participated: 12, created_at: '2025-12-10T11:00:00Z' },
  { id: '6', wallet_address: '2aBgH1jK6ZwXqPr2RtU4yBmC0LeIg9UsF5YtNzO2WZP', email: 'lisa.web3@proton.me', username: 'lisaweb3', role: 'user', kyc_status: 'verified', total_contributed: 89.3, launches_participated: 8, created_at: '2026-01-05T08:30:00Z' },
  { id: '7', wallet_address: '6cChJ2kL7AaYsQr3SuV5zBnA1NfJg8UtE4YzOuP3XZQ', email: 'david.dao@outlook.com', username: 'daviddao', role: 'admin', kyc_status: 'verified', total_contributed: 0, launches_participated: 0, created_at: '2025-11-20T12:00:00Z' },
  { id: '8', wallet_address: '4dDgK3mN8ZbXtPs3RtV6wBoC0MeIh7UtF5YzNuP2XWR', email: 'crypto.queen@gmail.com', username: 'cryptoqueen', role: 'user', kyc_status: 'rejected', total_contributed: 0, launches_participated: 0, created_at: '2026-02-28T15:45:00Z' },
];

export async function GET() {
  return NextResponse.json(mockUsers);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({ 
    id: Date.now().toString(),
    ...body,
    kyc_status: 'pending',
    total_contributed: 0,
    launches_participated: 0,
    created_at: new Date().toISOString()
  });
}

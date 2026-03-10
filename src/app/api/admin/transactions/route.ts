import { NextResponse } from 'next/server';

const transactions = [
  { id: 1, txHash: '0xabc123...', type: 'Buy', token: 'MEME', amount: 500, usdValue: 500, wallet: '0x1234...5678', status: 'Success', timestamp: '2026-03-05 14:30' },
  { id: 2, txHash: '0xdef456...', type: 'Claim', token: 'STAR', amount: 1000, usdValue: 1200, wallet: '0xabcd...efgh', status: 'Success', timestamp: '2026-03-04 10:15' },
  { id: 3, txHash: '0xghi789...', type: 'Buy', token: 'GFP', amount: 250, usdValue: 250, wallet: '0x9876...5432', status: 'Pending', timestamp: '2026-03-06 09:00' },
];

export async function GET() {
  return NextResponse.json({ transactions, total: transactions.length });
}

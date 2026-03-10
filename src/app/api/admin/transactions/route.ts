import { NextResponse } from 'next/server';

const mockTransactions = [
  { id: '1', user_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', type: 'buy', token_symbol: 'SML', amount_sol: 2.5, amount_token: 25000, status: 'confirmed', tx_signature: '5VERM8MruaZ8Xj4BbVjF3V3YfJk3X9Y2Z4XwVyZzH2K8F9H1J3K5L7M9N1P3Q5R7', created_at: '2026-03-10T23:15:00Z' },
  { id: '2', user_address: '9aZKTtbDwUY4G7F6LrE3v4QmW2NpQr5sT8XwVyZzH2K', type: 'buy', token_symbol: 'BONK', amount_sol: 5.0, amount_token: 50000, status: 'confirmed', tx_signature: '3ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz', created_at: '2026-03-10T22:45:00Z' },
  { id: '3', user_address: '3mBnK9hL7YvWqOp2RtU5xZmC1JdFg8TsE6YuUzP3WXL', type: 'claim', token_symbol: 'PXW', amount_sol: 0, amount_token: 125000, status: 'confirmed', tx_signature: '7ZYXWVUTSRQPONMLKJIHGFEDCBA9876543210zyxwvutsrqponmlkjihgfedcba', created_at: '2026-03-10T20:30:00Z' },
  { id: '4', user_address: '5nCpLQ9hL7YvWqOp2RtU5xZmC1JdFg8TsE6YuUzP3WXM', type: 'buy', token_symbol: 'SML', amount_sol: 1.0, amount_token: 10000, status: 'confirmed', tx_signature: '1QAZ2WSX3EDC4VFR5TGB6YHN7UJM8K9L0', created_at: '2026-03-10T18:20:00Z' },
  { id: '5', user_address: '8dEfG0iM8ZwXrPq3SuV6yAnB2NkOwR9TlAxBuCzJ4YK', type: 'buy', token_symbol: 'BONK', amount_sol: 10.0, amount_token: 100000, status: 'pending', tx_signature: '2WSX3EDC4VFR5TGB6YHN7UJM8K9L0P1', created_at: '2026-03-10T17:00:00Z' },
  { id: '6', user_address: '2aBgH1jK6ZwXqPr2RtU4yBmC0LeIg9UsF5YtNzO2WZP', type: 'claim', token_symbol: 'DFM', amount_sol: 0, amount_token: 5000, status: 'confirmed', tx_signature: '4RFV5TGB6YHN7UJM8K9L0P1QAZ3WSX', created_at: '2026-03-09T15:30:00Z' },
  { id: '7', user_address: '6cChJ2kL7AaYsQr3SuV5zBnA1NfJg8UtE4YzOuP3XZQ', type: 'buy', token_symbol: 'SML', amount_sol: 3.0, amount_token: 30000, status: 'confirmed', tx_signature: '5TGB6YHN7UJM8K9L0P1QAZ2WS3EDC', created_at: '2026-03-09T12:45:00Z' },
  { id: '8', user_address: '4dDgK3mN8ZbXtPs3RtV6wBoC0MeIh7UtF5YzNuP2XWR', type: 'refund', token_symbol: 'PXW', amount_sol: 1.5, amount_token: 0, status: 'confirmed', tx_signature: '6YHN7UJM8K9L0P1QAZ2WS3EDC4VF', created_at: '2026-03-08T10:00:00Z' },
];

export async function GET() {
  return NextResponse.json(mockTransactions);
}

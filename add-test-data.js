const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://htkslwnrqcdjspdyuqhg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3Nsd25ycWNkanNwZHl1cGgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0OTcwNiwiZXhwIjoxOTU4MTI1NzA2fQ.Vx5kORlLMLMdcVPBNT6-Tk9dJI6FbLHqQ0r6i3jC2E'
);

async function addTestData() {
  console.log('Adding test users...');
  
  // Add test users
  const { data: users, error: userError } = await supabase
    .from('users')
    .insert([
      { wallet_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', email: 'sarah@example.com', role: 'user', kyc_status: 'approved' },
      { wallet_address: '9aZKTtbDwUY4G7F6LrE3v4QmW2NpQr5sT8XwVyZzH2K', email: 'john@example.com', role: 'user', kyc_status: 'pending' },
      { wallet_address: '3mBnK9hL7YvWqOp2RtU5xZmC1JdFg8TsE6YuUzP3WXL', email: 'mike@example.com', role: 'admin', kyc_status: 'approved' },
      { wallet_address: '5nCpK8jM4YwXrLs9QuT6zAbNdFGo9UvW7ZfVxNyA2BM', email: 'emma@example.com', role: 'user', kyc_status: 'none' },
      { wallet_address: '8pDmH7kN5ZxAqLt0RwU7bAcOgIp3XvY9BsGyVcE1CPO', email: 'alex@example.com', role: 'user', kyc_status: 'rejected' },
    ])
    .select();

  if (userError) {
    console.log('Users error:', userError);
  } else {
    console.log('Users added:', users?.length);
  }

  // Add test KYC records
  const { data: kyc, error: kycError } = await supabase
    .from('kyc')
    .insert([
      { wallet_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', status: 'approved', document_type: 'passport' },
      { wallet_address: '9aZKTtbDwUY4G7F6LrE3v4QmW2NpQr5sT8XwVyZzH2K', status: 'pending', document_type: 'drivers_license' },
      { wallet_address: '8pDmH7kN5ZxAqLt0RwU7bAcOgIp3XvY9BsGyVcE1CPO', status: 'rejected', document_type: 'passport', rejection_reason: 'Document unclear' },
    ])
    .select();

  if (kycError) {
    console.log('KYC error:', kycError);
  } else {
    console.log('KYC added:', kyc?.length);
  }

  // Add test launches
  const { data: launches, error: launchError } = await supabase
    .from('launches')
    .insert([
      { name: 'Project Alpha', symbol: 'ALPHA', status: 'completed', token_price: 0.05, hard_cap: 50000, total_raised: 50000 },
      { name: 'Project Beta', symbol: 'BETA', status: 'active', token_price: 0.08, hard_cap: 75000, total_raised: 45000 },
      { name: 'Project Gamma', symbol: 'GAMMA', status: 'upcoming', token_price: 0.12, hard_cap: 100000, total_raised: 0 },
    ])
    .select();

  if (launchError) {
    console.log('Launches error:', launchError);
  } else {
    console.log('Launches added:', launches?.length);
  }

  console.log('Done!');
}

addTestData();

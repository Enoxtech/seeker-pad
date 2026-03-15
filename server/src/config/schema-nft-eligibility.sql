-- NFT Drops and Eligibility Schema for SeekerPad
-- Run this in Supabase SQL Editor

-- NFT Drops table
CREATE TABLE IF NOT EXISTS nft_drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  contract_address VARCHAR(255),
  candy_machine_id VARCHAR(255),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  supply_limit INTEGER DEFAULT 0,
  minted_count INTEGER DEFAULT 0,
  mint_price DECIMAL(20, 8) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eligibility Criteria for each drop
CREATE TABLE IF NOT EXISTS nft_eligibility_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id UUID REFERENCES nft_drops(id) ON DELETE CASCADE,
  require_app_download BOOLEAN DEFAULT false,
  require_onchain_trade BOOLEAN DEFAULT false,
  require_skr_tokens BOOLEAN DEFAULT false,
  min_skr_amount DECIMAL(20, 8) DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User eligibility records
CREATE TABLE IF NOT EXISTS nft_eligibility_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id UUID REFERENCES nft_drops(id) ON DELETE CASCADE,
  user_address VARCHAR(255) NOT NULL,
  has_app_download BOOLEAN DEFAULT false,
  has_onchain_trade BOOLEAN DEFAULT false,
  has_min_skr_tokens BOOLEAN DEFAULT false,
  is_eligible BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(drop_id, user_address)
);

-- Track app downloads (user logged in via SeekerPad app)
CREATE TABLE IF NOT EXISTS seekerpad_app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(255) UNIQUE NOT NULL,
  device_id VARCHAR(255),
  app_installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nft_drops_active ON nft_drops(is_active, start_date);
CREATE INDEX IF NOT EXISTS idx_eligibility_records_user ON nft_eligibility_records(user_address);
CREATE INDEX IF NOT EXISTS idx_eligibility_records_drop ON nft_eligibility_records(drop_id);
CREATE INDEX IF NOT EXISTS idx_app_users_wallet ON seekerpad_app_users(wallet_address);

-- User transactions (for onchain trade tracking)
CREATE TABLE IF NOT EXISTS user_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address VARCHAR(255) NOT NULL,
  tx_signature VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) DEFAULT 'trade',
  token_in VARCHAR(50),
  token_out VARCHAR(50),
  amount_in DECIMAL(20, 8),
  amount_out DECIMAL(20, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token balances (for SKR token tracking - simplified)
CREATE TABLE IF NOT EXISTS token_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address VARCHAR(255) NOT NULL,
  token_symbol VARCHAR(20) NOT NULL,
  token_address VARCHAR(255),
  amount DECIMAL(20, 8) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_address, token_symbol)
);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_user_transactions_user ON user_transactions(user_address);
CREATE INDEX IF NOT EXISTS idx_token_balances_user ON token_balances(user_address, token_symbol);

-- Enable RLS (optional - enable if using Supabase auth)
-- ALTER TABLE nft_drops ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE nft_eligibility_criteria ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE nft_eligibility_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE seekerpad_app_users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE token_balances ENABLE ROW LEVEL SECURITY;
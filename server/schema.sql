-- SeekerPad Database Schema
-- Run this against your PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Launches table
CREATE TABLE IF NOT EXISTS launches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    twitter_url VARCHAR(500),
    telegram_url VARCHAR(500),
    
    -- Sale type
    type VARCHAR(20) DEFAULT 'standard', -- 'standard' or 'elite'
    
    -- Status
    status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'live', 'ended'
    
    -- Tokenomics
    total_supply BIGINT NOT NULL,
    launch_price DECIMAL(20, 10) NOT NULL,
    initial_liquidity_percent DECIMAL(5, 2),
    raise_target BIGINT,
    total_raised BIGINT DEFAULT 0,
    
    -- Allocation
    min_allocation DECIMAL(20, 9),
    max_allocation DECIMAL(20, 9),
    elite_allocation_percent DECIMAL(5, 2),
    
    -- Timing
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    tge_date TIMESTAMP,
    vesting_start TIMESTAMP,
    vesting_duration_months INTEGER,
    vesting_cliff_months INTEGER,
    initial_unlock_percent DECIMAL(5, 2),
    
    -- Stats
    participants_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User participations
CREATE TABLE IF NOT EXISTS participations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    launch_id UUID REFERENCES launches(id) ON DELETE CASCADE,
    user_address VARCHAR(44) NOT NULL,
    
    -- Amounts
    amount_sol DECIMAL(20, 9) NOT NULL,
    tokens_received BIGINT NOT NULL,
    claimable_amount BIGINT DEFAULT 0,
    claimed_amount BIGINT DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'claimed', 'vesting'
    
    -- Transaction
    tx_signature VARCHAR(100),
    claimed_tx_signature VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    claimed_at TIMESTAMP,
    
    UNIQUE(launch_id, user_address)
);

-- User NFTs
CREATE TABLE IF NOT EXISTS user_nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_address VARCHAR(44) NOT NULL,
    mint_address VARCHAR(44) NOT NULL,
    
    -- Category
    category VARCHAR(50) NOT NULL, -- 'saga-genesis', 'seeker-pioneer', etc.
    
    -- Metadata
    metadata_url VARCHAR(500),
    image_url VARCHAR(500),
    
    -- Transaction
    tx_signature VARCHAR(100),
    
    -- Timestamps
    mint_date TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(mint_address)
);

-- NFT Categories with supply limits
CREATE TABLE IF NOT EXISTS nft_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    supply_limit INTEGER NOT NULL,
    minted INTEGER DEFAULT 0,
    eligibility_criteria TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Staking positions (for tier calculation)
CREATE TABLE IF NOT EXISTS staking_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_address VARCHAR(44) NOT NULL,
    protocol VARCHAR(50) NOT NULL, -- 'jupiter', 'bonk', 'meteora', 'seek'
    amount BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_address, protocol)
);

-- Eligibility verifications
CREATE TABLE IF NOT EXISTS eligibility_verification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_address VARCHAR(44) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_eligible BOOLEAN DEFAULT false,
    balance_snapshot BIGINT,
    verified_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_address, category)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_participations_launch ON participations(launch_id);
CREATE INDEX IF NOT EXISTS idx_participations_user ON participations(user_address);
CREATE INDEX IF NOT EXISTS idx_user_nfts_owner ON user_nfts(owner_address);
CREATE INDEX IF NOT EXISTS idx_staking_user ON staking_positions(user_address);
CREATE INDEX IF NOT EXISTS idx_eligibility_user ON eligibility_verification(user_address);

-- Insert default NFT categories
INSERT INTO nft_categories (category, name, description, supply_limit, eligibility_criteria) VALUES
    ('saga-genesis', 'Saga Genesis', 'For Saga device NFT holders', 10000, 'Hold Saga Genesis NFT'),
    ('seeker-pioneer', 'Seeker Pioneer', 'For Seeker device owners', 50000, 'Verify Seeker device ownership'),
    ('jupiter-aligned', 'Jupiter Aligned', 'For JUP stakers', 25000, 'Stake minimum 10,000 JUP'),
    ('bonk-community', 'Bonk Community', 'For BONK stakers', 25000, 'Stake minimum 1,000,000 BONK'),
    ('meteora-lp', 'Meteora LP', 'For Meteora LPs', 15000, 'Provide liquidity on Meteora')
ON CONFLICT (category) DO NOTHING;

-- Insert sample launches
INSERT INTO launches (name, symbol, description, type, status, total_supply, launch_price, raise_target, total_raised, start_time, end_time) VALUES
    ('Bonkify', 'BKFY', 'Mobile-first meme coin trading platform', 'elite', 'live', 5000000000, 0.001, 2000000, 1560000, '2025-03-25 14:00:00', '2025-03-25 20:00:00'),
    ('SolanaSaga Phone', 'SAGA', 'The next generation blockchain phone', 'standard', 'upcoming', 1000000000, 0.005, 5000000, 0, '2025-04-01 14:00:00', '2025-04-07 20:00:00'),
    ('SeekerX', 'SKRX', 'DeFi suite built for the Seeker ecosystem', 'elite', 'ended', 100000000, 0.01, 1000000, 1000000, '2025-03-20 14:00:00', '2025-03-22 20:00:00')
ON CONFLICT DO NOTHING;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_launches_updated_at
    BEFORE UPDATE ON launches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_participations_updated_at
    BEFORE UPDATE ON participations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Project Applications
CREATE TABLE IF NOT EXISTS project_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    description TEXT,
    website VARCHAR(500),
    twitter VARCHAR(500),
    telegram VARCHAR(500),
    whitepaper_url VARCHAR(500),
    tokenomics JSONB,
    team_info JSONB,
    contact_email VARCHAR(255) NOT NULL,
    launch_type VARCHAR(20) DEFAULT 'standard',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP
);

-- Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin', -- 'admin', 'super_admin'
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- KYC Applications
CREATE TABLE IF NOT EXISTS kyc_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(44) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    document_type VARCHAR(50), -- 'passport', 'drivers_license', 'national_id'
    document_url VARCHAR(500),
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES admin_users(id)
);

-- Transactions (for admin view)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_address VARCHAR(44) NOT NULL,
    launch_id UUID REFERENCES launches(id),
    type VARCHAR(20) NOT NULL, -- 'participation', 'claim', 'withdrawal', 'purchase'
    amount_sol DECIMAL(20, 9) NOT NULL,
    tokens_amount BIGINT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    tx_signature VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL, -- 'email', 'sms'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    recipients JSONB NOT NULL, -- {type: 'all' | 'wallets', addresses: []}
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'failed'
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    stats JSONB -- {sent: 0, delivered: 0, opened: 0}
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admin_users(id),
    admin_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, role, name) VALUES 
    ('admin@seekepad.com', '$2a$10$yourhashhere', 'super_admin', 'Main Admin')
ON CONFLICT (email) DO NOTHING;

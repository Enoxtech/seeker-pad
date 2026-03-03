# SeekerPad Backend API

Express.js API for SeekerPad launchpad.

## Setup

```bash
cd server
npm install
```

## Database Setup

1. Create PostgreSQL database
2. Run schema:
```bash
psql -U postgres -d seekerpad -f schema.sql
```

## Environment Variables

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seekerpad
DB_USER=postgres
DB_PASSWORD=your_password
SOLANA_NETWORK=devnet
```

## Run

```bash
npm run dev
```

## API Endpoints

### Launches
- `GET /api/launches` - List all launches
- `GET /api/launches/:id` - Get launch details
- `POST /api/launches` - Create launch (admin)

### Participation
- `GET /api/participation/user/:address` - User's participations
- `POST /api/participation` - Create participation
- `POST /api/participation/:id/claim` - Claim tokens

### Eligibility
- `GET /api/eligibility/:address` - Check eligibility
- `GET /api/eligibility/:address/tier` - Get tier

### NFT
- `GET /api/nft/user/:address` - User's NFTs
- `GET /api/nft/categories` - NFT categories
- `POST /api/nft/mint` - Mint NFT

### Wallet
- `GET /api/wallet/:address/balance` - Get balance
- `POST /api/wallet/verify` - Verify wallet

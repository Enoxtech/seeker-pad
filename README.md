# SeekerPad

A modern, mobile-first Solana launchpad for Seeker & Saga users.

## Features

- 🎯 **Launch Discovery** - Browse and filter token launches
- 👛 **Wallet Connection** - Phantom, Solflare support
- 👤 **Profile Dashboard** - Track participations, NFTs, staking
- 🎫 **NFT Access** - Seeker Pad NFTs for Elite features
- 📱 **Mobile-First** - Optimized for mobile devices

## Getting Started

```bash
# Install dependencies
npm install

# Install wallet packages
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js

# Run development
npm run dev
```

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Solana Web3.js + Wallet Adapter
- TypeScript

## Project Structure

```
src/
├── app/              # Pages
│   ├── page.tsx     # Home
│   ├── launchpad/   # Launch listing
│   ├── launch/[id]/ # Launch detail
│   ├── profile/     # User profile
│   └── nft/         # NFT hub
├── components/      # UI components
├── contexts/        # Wallet provider
├── data/           # Mock data
├── hooks/          # Custom hooks
├── lib/            # Utils
└── types/          # TypeScript types
```

## Design

- Dark theme with purple/blue gradients
- Mobile-first responsive design
- Glass morphism effects
- Smooth animations

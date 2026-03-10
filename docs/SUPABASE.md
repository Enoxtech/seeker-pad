# Supabase Setup Guide

## Overview
This document outlines how to connect the admin panel to Supabase for real data.

## Environment Variables Required

Add these to Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Security Notes

1. **Never expose service role key** - Only use anon key in frontend
2. **Row Level Security (RLS)** - Enable on all tables
3. **Input validation** - Sanitize all user inputs
4. **Rate limiting** - Consider adding rate limits

## Database Schema

### users table
- id (uuid, primary key)
- wallet_address (text, unique)
- email (text)
- role (text) - 'user' | 'admin'
- kyc_status (text) - 'none' | 'pending' | 'verified' | 'rejected'
- created_at (timestamp)
- updated_at (timestamp)

### launches table
- id (uuid, primary key)
- name (text)
- symbol (text)
- status (text) - 'draft' | 'upcoming' | 'live' | 'ended'
- target_amount (numeric)
- raised_amount (numeric)
- start_date (timestamp)
- end_date (timestamp)
- created_at (timestamp)

### transactions table
- id (uuid, primary key)
- user_id (uuid, foreign key)
- launch_id (uuid, foreign key)
- type (text) - 'buy' | 'claim' | 'refund'
- amount (numeric)
- tx_hash (text)
- status (text) - 'pending' | 'confirmed' | 'failed'
- created_at (timestamp)

## API Routes

All admin API routes are in `/src/app/api/admin/`:
- `/users` - User management
- `/launches` - Launch management
- `/kyc` - KYC verification
- `/transactions` - Transaction history

## Next Steps

1. Set up Supabase project
2. Create tables with RLS
3. Add environment variables to Vercel
4. Test API connections

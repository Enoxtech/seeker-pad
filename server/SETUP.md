# SeekerPad Backend Setup Script
# Run this to set up the database and start the server

# Prerequisites:
# 1. Install PostgreSQL from https://www.postgresql.org/download/
# 2. Make sure PostgreSQL is running

# Step 1: Install Node.js dependencies
cd server
npm install

# Step 2: Create PostgreSQL database
# Run this in PostgreSQL:
# CREATE DATABASE seekerpad;

# Step 3: Copy environment file and configure
copy .env.example .env
# Edit .env with your database credentials

# Step 4: Initialize database schema
# You can run the schema.sql file in PostgreSQL:
# psql -U postgres -d seekerpad -f schema.sql

# Step 5: Start the server
npm run dev

# The API will be available at http://localhost:3002

# For production:
# 1. Change SOLANA_NETWORK=mainnet in .env
# 2. Change NODE_ENV=production in .env
# 3. Set a strong JWT_SECRET

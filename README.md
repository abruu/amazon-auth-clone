# Amazon Auth Clone - Setup Guide

This is a simple demo project that stores email and password credentials in Supabase (without authentication logic).

## Features

- Simple login form (email + password)
- Data stored directly in Supabase table
- Automatic redirect to `/login` when visiting home page
- No authentication - just data storage for demo purposes

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

You need to create the database table in your Supabase project.

#### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL from `supabase/migrations/001_create_user_credentials.sql`:

```sql
-- Create user_credentials table to store login attempts
CREATE TABLE IF NOT EXISTS user_credentials (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for demo purposes)
CREATE POLICY "Allow public inserts" ON user_credentials
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow reads for authenticated users (optional)
CREATE POLICY "Allow public reads" ON user_credentials
  FOR SELECT
  TO public
  USING (true);
```

#### Option B: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db push
```

### 3. Configure Environment Variables

Make sure your Supabase connection is configured in the codebase (check `src/integrations/supabase/client.ts`).

### 4. Run the Development Server

```bash
# Make sure you're using Node 20.19+ or 22.12+
nvm use 22

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:8081/` (or another port if 8081 is in use).

## How It Works

1. When you visit `/`, it automatically redirects to `/login`
2. Enter any email and password (min 6 characters)
3. Click "Continue" to store the credentials in Supabase
4. The data is stored in the `user_credentials` table

## Important Notes

⚠️ **This is a demo project only!**

- Passwords are stored in **plain text** (never do this in production!)
- No real authentication is performed
- Public read/write access is enabled on the table
- This is for learning/testing purposes only

## Tech Stack

- **Framework**: TanStack Router + React
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Build Tool**: Vite
- **Runtime**: Node.js 22+

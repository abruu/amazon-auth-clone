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

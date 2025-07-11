/*
  # Zoovio Database Schema

  1. New Tables
    - `users` - User accounts with authentication
    - `pets` - Pet listings with details and availability
    - `orders` - Customer orders with status tracking
    - `order_items` - Individual items within orders
    - `transactions` - Payment transaction history
    - `adoptions` - Pet adoption applications

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Secure payment and transaction data

  3. Indexes
    - Performance indexes on frequently queried columns
    - Unique constraints for data integrity
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  phone varchar(20),
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  type varchar(20) NOT NULL CHECK (type IN ('dog', 'cat')),
  breed varchar(100) NOT NULL,
  age varchar(20),
  price decimal(10,2) NOT NULL,
  description text,
  image_url text,
  gender varchar(10) CHECK (gender IN ('male', 'female')),
  color varchar(50),
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method varchar(50),
  stripe_session_id varchar(255),
  shipping_address jsonb,
  tracking_number varchar(100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES pets(id),
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  stripe_session_id varchar(255),
  stripe_payment_intent_id varchar(255),
  amount decimal(10,2) NOT NULL,
  currency varchar(3) DEFAULT 'usd',
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method varchar(50),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create adoptions table
CREATE TABLE IF NOT EXISTS adoptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(20),
  address text,
  pet_type varchar(20) CHECK (pet_type IN ('dog', 'cat', 'either')),
  experience varchar(50),
  living_space varchar(50),
  other_pets text,
  work_schedule varchar(50),
  reason text,
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Anyone can view available pets
CREATE POLICY "Anyone can view pets"
  ON pets FOR SELECT
  USING (true);

-- Users can only view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only view their own order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Users can only view their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = transactions.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Anyone can submit adoption applications
CREATE POLICY "Anyone can submit adoptions"
  ON adoptions FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_pets_type ON pets(type);
CREATE INDEX IF NOT EXISTS idx_pets_breed ON pets(breed);
CREATE INDEX IF NOT EXISTS idx_pets_available ON pets(available);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_session_id ON transactions(stripe_session_id);

-- Insert sample pets data
INSERT INTO pets (name, type, breed, age, price, description, image_url, gender, color, available) VALUES
  ('Max', 'dog', 'Golden Retriever', '2 years', 1200.00, 'Friendly and energetic golden retriever, perfect for families with children.', 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400', 'male', 'Golden', true),
  ('Bella', 'dog', 'German Shepherd', '1 year', 1500.00, 'Intelligent German Shepherd puppy, excellent for training and protection.', 'https://images.pexels.com/photos/1346086/pexels-photo-1346086.jpeg?auto=compress&cs=tinysrgb&w=400', 'female', 'Black & Tan', true),
  ('Buddy', 'dog', 'Labrador Mix', '3 years', 950.00, 'Loyal and trained labrador mix, great with children and other pets.', 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400', 'male', 'Brown', true),
  ('Rocky', 'dog', 'Bulldog', '4 years', 1800.00, 'Calm and gentle bulldog, perfect for apartment living.', 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400', 'male', 'Brindle', true),
  ('Luna', 'dog', 'Siberian Husky', '2 years', 1350.00, 'Beautiful Siberian Husky with striking blue eyes and energetic personality.', 'https://images.pexels.com/photos/1269118/pexels-photo-1269118.jpeg?auto=compress&cs=tinysrgb&w=400', 'female', 'Black & White', true),
  ('Charlie', 'dog', 'Beagle', '6 months', 800.00, 'Adorable beagle puppy, friendly and great with families.', 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=400', 'male', 'Tri-color', true),
  ('Luna', 'cat', 'Persian Cat', '1 year', 800.00, 'Beautiful Persian cat with long fluffy fur and gentle personality.', 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400', 'female', 'White', true),
  ('Shadow', 'cat', 'Maine Coon', '2 years', 1200.00, 'Majestic Maine Coon with impressive size and friendly demeanor.', 'https://images.pexels.com/photos/1571076/pexels-photo-1571076.jpeg?auto=compress&cs=tinysrgb&w=400', 'male', 'Brown Tabby', true),
  ('Whiskers', 'cat', 'Siamese', '6 months', 600.00, 'Playful Siamese kitten with striking blue eyes and vocal personality.', 'https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=400', 'male', 'Seal Point', true),
  ('Mittens', 'cat', 'British Shorthair', '3 years', 900.00, 'Calm British Shorthair with round face and plush coat.', 'https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=400', 'female', 'Blue', true),
  ('Ginger', 'cat', 'Orange Tabby', '1 year', 500.00, 'Friendly orange tabby with a loving and social personality.', 'https://images.pexels.com/photos/1123999/pexels-photo-1123999.jpeg?auto=compress&cs=tinysrgb&w=400', 'male', 'Orange', true),
  ('Princess', 'cat', 'Ragdoll', '2 years', 1100.00, 'Gentle Ragdoll with beautiful blue eyes and docile temperament.', 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', 'female', 'Colorpoint', true)
ON CONFLICT DO NOTHING;
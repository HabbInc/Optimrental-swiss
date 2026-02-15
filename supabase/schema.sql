-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_per_hour NUMERIC NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    customer_name TEXT,
    customer_email TEXT NOT NULL,
    licence_no TEXT,
    nationality TEXT,
    mobile_no TEXT,
    booking_date DATE NOT NULL,
    hours INTEGER NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for vehicles (public read)
CREATE POLICY "Public can view vehicles" ON vehicles
    FOR SELECT USING (true);

-- Admin policies for vehicles
CREATE POLICY "Admins can insert vehicles" ON vehicles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update vehicles" ON vehicles
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete vehicles" ON vehicles
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for bookings (public insert)
CREATE POLICY "Public can create bookings" ON bookings
    FOR INSERT WITH CHECK (true);

-- Admin policies for bookings
CREATE POLICY "Admins can view all bookings" ON bookings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update bookings" ON bookings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ALTER SQL STATEMENTS
-- ALTER TABLE vehicles ADD COLUMN features TEXT[] DEFAULT '{}';
-- ALTER TABLE bookings ADD COLUMN customer_name TEXT;
-- ALTER TABLE bookings ADD COLUMN licence_no TEXT;
-- ALTER TABLE bookings ADD COLUMN nationality TEXT;
-- ALTER TABLE bookings ADD COLUMN mobile_no TEXT;
-- ALTER TABLE vehicles ADD COLUMN images TEXT[] DEFAULT '{}';

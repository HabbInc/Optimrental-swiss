export interface Vehicle {
    id: string;
    name: string;
    description: string;
    price_per_hour: number;
    image_url: string;
    images?: string[];
    is_available: boolean;
    features?: string[];
    created_at?: string;
    // Vehicle specifications
    manufacturer?: string;
    model?: string;
    year?: number;
    transmission?: string;
    fuel_type?: string;
    width?: number;
    length?: number;
    height?: number;
    curb_weight?: number;
    max_gross_weight?: number;
    euro_class?: string;
    winter_ready?: boolean;
    winter_tires?: boolean;
    studded_tires?: boolean;
    child_seat_space?: boolean;
    seat_count?: number;
}

export interface Booking {
    id?: string;
    vehicle_id: string;
    customer_name?: string;
    customer_email: string;
    licence_no?: string;
    nationality?: string;
    mobile_no?: string;
    booking_date: string;
    hours: number;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at?: string;
}

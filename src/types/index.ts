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

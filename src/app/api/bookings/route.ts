import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const {
            vehicle_id,
            customer_name,
            customer_email,
            licence_no,
            nationality,
            mobile_no,
            booking_date,
            hours,
            vehicle_name
        } = await req.json();

        // 1. Fetch vehicle to get actual price per hour (Server-side validation)
        const { data: vehicle, error: vError } = await supabaseAdmin
            .from('vehicles')
            .select('price_per_hour, name')
            .eq('id', vehicle_id)
            .single();

        if (vError || !vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        const calculatedTotalPrice = vehicle.price_per_hour * hours;

        // 2. Create booking in Supabase
        const { data: booking, error: bError } = await supabaseAdmin
            .from('bookings')
            .insert({
                vehicle_id,
                customer_name,
                customer_email,
                licence_no,
                nationality,
                mobile_no,
                booking_date,
                hours,
                total_price: calculatedTotalPrice,
                status: 'pending'
            })
            .select()
            .single();

        if (bError) {
            console.error('Booking Error:', bError);
            return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
        }

        // 3. Send confirmation email
        try {
            await sendBookingConfirmation(customer_email, {
                vehicleName: vehicle.name,
                date: booking_date,
                hours,
                totalPrice: calculatedTotalPrice
            });
        } catch (emailError) {
            console.error('Email Error:', emailError);
            // We don't fail the booking if email fails, but we should log it
        }

        return NextResponse.json({ success: true, booking });
    } catch (error) {
        console.error('Request Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

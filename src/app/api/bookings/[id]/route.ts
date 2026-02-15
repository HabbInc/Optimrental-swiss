import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendAdminConfirmation } from '@/lib/email';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { status } = await req.json();
        const { id } = await params;

        // 1. Update booking status
        const { data: booking, error: bError } = await supabaseAdmin
            .from('bookings')
            .update({ status })
            .eq('id', id)
            .select('*, vehicles(name)')
            .single();

        if (bError) {
            return NextResponse.json({ error: bError.message }, { status: 500 });
        }

        // 2. If status is 'confirmed', send email to customer
        if (status === 'confirmed') {
            try {
                await sendAdminConfirmation(booking.customer_email, {
                    vehicleName: (booking.vehicles as any).name,
                    date: booking.booking_date,
                    hours: booking.hours,
                    totalPrice: booking.total_price
                });
            } catch (emailError) {
                console.error('Email confirmation error:', emailError);
            }
        }

        return NextResponse.json({ success: true, booking });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

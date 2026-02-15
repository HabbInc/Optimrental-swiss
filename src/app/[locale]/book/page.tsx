import { getTranslations } from 'next-intl/server';
import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types';
import BookingForm from '@/components/BookingForm';
import Navbar from '@/components/layout/Navbar';
import { Car } from 'lucide-react';

export default async function BookPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('Booking');

    const { data: vehicles } = await supabase
        .from('vehicles')
        .select('*')
        .eq('is_available', true);

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Car className="w-3 h-3" />
                            <span>Premium Booking</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase">
                            {t('title').split(' ')[0]} <span className="text-amber-500">{t('title').split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
                            Select your preferred vehicle from our luxury fleet and schedule your premium journey in seconds.
                        </p>
                        <div className="h-1.5 w-20 bg-amber-500 mx-auto rounded-full mt-6" />
                    </div>

                    <BookingForm vehicles={vehicles || []} locale={locale} />
                </div>
            </div>
        </main>
    );
}

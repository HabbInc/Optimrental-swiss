"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, CalendarDays, Wallet, Clock, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalVehicles: 0,
        totalBookings: 0,
        pendingBookings: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const { data: v } = await supabase.from('vehicles').select('id');
        const { data: b } = await supabase.from('bookings').select('status, total_price');

        const totalRevenue = b?.reduce((acc, curr) => acc + (curr.status === 'confirmed' ? Number(curr.total_price) : 0), 0) || 0;

        setStats({
            totalVehicles: v?.length || 0,
            totalBookings: b?.length || 0,
            pendingBookings: b?.filter(x => x.status === 'pending').length || 0,
            totalRevenue
        });
    };

    const cards = [
        { title: 'Total Vehicles', value: stats.totalVehicles, icon: <Car className="text-amber-500" />, color: 'bg-amber-50' },
        { title: 'Total Bookings', value: stats.totalBookings, icon: <CalendarDays className="text-blue-500" />, color: 'bg-blue-50' },
        { title: 'Pending Actions', value: stats.pendingBookings, icon: <Clock className="text-rose-500" />, color: 'bg-rose-50' },
        { title: 'Confirmed Revenue', value: `${stats.totalRevenue.toFixed(2)} CHF`, icon: <Wallet className="text-green-500" />, color: 'bg-green-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Overview</h1>
                <p className="text-slate-500 font-medium">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <Card key={i} className="rounded-3xl border-none shadow-xl hover:shadow-2xl transition-all duration-300 group">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start">
                                <div className={cn("p-4 rounded-2xl", card.color)}>
                                    {card.icon}
                                </div>
                                <div className="bg-slate-50 px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-black uppercase text-slate-400">
                                    <TrendingUp size={10} /> +2.5%
                                </div>
                            </div>
                            <div className="mt-6 space-y-1">
                                <div className="text-3xl font-black text-slate-900">{card.value}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-3xl border-none shadow-xl p-8 bg-slate-900 text-white">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-white/10 hover:bg-white/20 p-6 rounded-2xl text-left transition-colors group">
                            <div className="bg-amber-500 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Car className="text-white" size={20} />
                            </div>
                            <div className="font-bold">Add New Car</div>
                            <div className="text-xs text-slate-400">Expand your fleet</div>
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 p-6 rounded-2xl text-left transition-colors group">
                            <div className="bg-blue-500 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <CalendarDays className="text-white" size={20} />
                            </div>
                            <div className="font-bold">Check Bookings</div>
                            <div className="text-xs text-slate-400">View latest updates</div>
                        </button>
                    </div>
                </Card>

                <Card className="rounded-3xl border-none shadow-xl p-8 bg-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16" />
                    <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                        Business Health
                        <span className="text-xs font-normal text-slate-400">Daily Average</span>
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Booking Conversion', val: '78%' },
                            { label: 'Vehicle Utilization', val: '64%' },
                            { label: 'Customer Satisfaction', val: '98%' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span>{item.label}</span>
                                    <span>{item.val}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 rounded-full" style={{ width: item.val }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

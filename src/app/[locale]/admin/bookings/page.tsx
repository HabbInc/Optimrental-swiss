"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Booking, Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Search, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchBookings();
    }, [statusFilter]);

    const fetchBookings = async () => {
        setLoading(true);
        let query = supabase
            .from('bookings')
            .select('*, vehicles(name)')
            .order('created_at', { ascending: false });

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;
        if (error) toast.error(error.message);
        else setBookings(data || []);
        setLoading(false);
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast.success(`Booking ${status} successfully`);
                fetchBookings();
            } else {
                toast.error('Failed to update status');
            }
        } catch (err) {
            toast.error('Error updating status');
        }
    };

    const filteredBookings = bookings.filter(b =>
        (b.customer_email?.toLowerCase().includes(search.toLowerCase())) ||
        (b.customer_name?.toLowerCase().includes(search.toLowerCase())) ||
        (b.mobile_no?.includes(search)) ||
        (b.vehicles?.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Bookings</h1>
                    <p className="text-slate-500">Manage customer reservations and appointments</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search name, email, mobile..."
                            className="pl-10 h-11 rounded-xl w-full md:w-72"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-11 rounded-xl w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest p-6">Customer</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest">Verification</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest">Rental Trip</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest text-center">Date</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest">Status</TableHead>
                            <TableHead className="uppercase text-[10px] font-bold tracking-widest text-right p-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center p-12 text-slate-400">Loading bookings...</TableCell></TableRow>
                        ) : filteredBookings.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center p-12 text-slate-400">No bookings found.</TableCell></TableRow>
                        ) : filteredBookings.map((b) => (
                            <TableRow key={b.id} className="hover:bg-slate-50">
                                <TableCell className="p-6">
                                    <div className="font-extrabold text-slate-900">{b.customer_name || 'N/A'}</div>
                                    <div className="text-[11px] text-slate-600 font-medium">{b.customer_email}</div>
                                    <div className="text-[11px] text-slate-500">{b.mobile_no}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs font-bold text-slate-700">Licence: <span className="font-mono text-slate-900">{b.licence_no || 'N/A'}</span></div>
                                    <div className="text-[10px] uppercase font-black text-amber-600 tracking-wider flex items-center gap-1.5 mt-1">
                                        <Filter size={10} /> {b.nationality || 'Other'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-bold text-slate-800">{b.vehicles?.name}</div>
                                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                        <Clock size={11} /> {b.hours} Days • <span className="font-black text-slate-900">{b.total_price} CHF</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg text-xs font-medium">
                                        <Calendar size={12} /> {format(new Date(b.booking_date), 'dd.MM.yyyy')}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                        b.status === 'confirmed' ? "bg-green-100 text-green-700" :
                                            b.status === 'cancelled' ? "bg-red-100 text-red-700" :
                                                "bg-amber-100 text-amber-700"
                                    )}>
                                        {b.status}
                                    </span>
                                </TableCell>
                                <TableCell className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        {b.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl border-green-200 text-green-600 hover:bg-green-50"
                                                    onClick={() => updateStatus(b.id, 'confirmed')}
                                                >
                                                    <CheckCircle size={16} className="mr-2" /> Confirm
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                                                    onClick={() => updateStatus(b.id, 'cancelled')}
                                                >
                                                    <XCircle size={16} className="mr-2" /> Cancel
                                                </Button>
                                            </>
                                        )}
                                        {(b.status === 'confirmed' || b.status === 'cancelled') && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="rounded-xl text-slate-400 hover:text-slate-600"
                                                onClick={() => updateStatus(b.id, 'pending')}
                                            >
                                                Reset to Pending
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

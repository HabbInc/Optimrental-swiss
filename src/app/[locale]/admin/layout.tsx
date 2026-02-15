"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Car, LayoutDashboard, CalendarDays, LogOut } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
            if (!session && !pathname.includes('/login')) {
                router.push('/admin/login');
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session && !pathname.includes('/login')) {
                router.push('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [router, pathname]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session && !pathname.includes('/login')) {
        return null;
    }

    if (pathname.includes('/login')) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-8 border-b border-slate-800">
                    <Link href="/admin/dashboard" className="flex flex-col items-center gap-4">
                        <img src="/optimrental-logo.png" alt="Optimrental Logo" className="h-16 w-auto object-contain" />
                        <span className="font-black text-xs tracking-[0.4em] text-amber-500 uppercase">Admin Portal</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 pt-8">
                    <Link
                        href="/admin/dashboard"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                            pathname.includes('/dashboard') ? "bg-amber-500 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link
                        href="/admin/vehicles"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                            pathname.includes('/vehicles') ? "bg-amber-500 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <Car size={20} /> Vehicles
                    </Link>
                    <Link
                        href="/admin/bookings"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                            pathname.includes('/bookings') ? "bg-amber-500 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <CalendarDays size={20} /> Bookings
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 gap-3"
                        onClick={() => supabase.auth.signOut()}
                    >
                        <LogOut size={20} /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

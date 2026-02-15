"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

export default function AdminLoginPage({ params }: { params: { locale: string } }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('Admin.login');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Logged in successfully');
            router.push(`/admin/dashboard`);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
            <Card className="w-full max-w-md shadow-2xl border-none rounded-3xl overflow-hidden">
                <div className="bg-slate-900 p-8 text-white text-center space-y-2">
                    <div className="bg-amber-500 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-white" />
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">{t('title')}</CardTitle>
                    <p className="text-slate-400 text-sm">Secure access for Optimrental administrators</p>
                </div>
                <CardContent className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">{t('email')}</Label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="uppercase text-[10px] font-bold tracking-widest text-slate-500">{t('password')}</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 rounded-xl"
                                required
                            />
                        </div>
                        <Button disabled={isLoading} className="w-full h-12 bg-slate-900 hover:bg-slate-800 rounded-xl font-bold">
                            {isLoading ? "Signing in..." : t('submit')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

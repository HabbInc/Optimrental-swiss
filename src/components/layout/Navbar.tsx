"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Menu, X, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams, usePathname } from 'next/navigation';

export default function Navbar() {
    const t = useTranslations('Index');
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { locale } = useParams();
    const pathname = usePathname();
    const isHome = pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-10 py-3 md:py-4",
            (isScrolled || !isHome) ? "bg-white shadow-md border-b" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 md:gap-3">
                    <img
                        src="/optimrental-logo.png"
                        alt="Optimrental Logo"
                        className="h-10 md:h-16 lg:h-20 w-auto object-contain transition-all hover:scale-105"
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-6 xl:gap-10">
                    <div className="flex items-center gap-4 xl:gap-8">
                        <Link href="/#services" className={cn(
                            "font-bold uppercase text-[13px] tracking-[0.2em] transition-all hover:text-amber-500",
                            (isScrolled || !isHome) ? "text-slate-600" : "text-white/90 drop-shadow-sm"
                        )}>
                            {t('services').split(' ')[0]}
                        </Link>
                        <Link href="/#vehicles" className={cn(
                            "font-bold uppercase text-[13px] tracking-[0.2em] transition-all hover:text-amber-500",
                            (isScrolled || !isHome) ? "text-slate-600" : "text-white/90 drop-shadow-sm"
                        )}>
                            {t('vehicles')}
                        </Link>
                        <Link href="/#contact" className={cn(
                            "font-bold uppercase text-[13px] tracking-[0.2em] transition-all hover:text-amber-500",
                            (isScrolled || !isHome) ? "text-slate-600" : "text-white/90 drop-shadow-sm"
                        )}>
                            {t('contact')}
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 xl:gap-6 pl-6 xl:pl-10 border-l border-slate-500/20">
                        <div className={cn(
                            "flex items-center gap-1 p-1 rounded-full border transition-all",
                            (isScrolled || !isHome) ? "bg-slate-100 border-slate-200" : "bg-white/10 border-white/20 backdrop-blur-md"
                        )}>
                            <Link
                                href="/"
                                locale="de"
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-black transition-all",
                                    locale === 'de'
                                        ? "bg-amber-500 text-white shadow-sm scale-105"
                                        : ((isScrolled || !isHome) ? "text-slate-400 hover:text-slate-900" : "text-white/60 hover:text-white")
                                )}
                            >
                                DE
                            </Link>
                            <Link
                                href="/"
                                locale="en"
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-black transition-all",
                                    locale === 'en'
                                        ? "bg-amber-500 text-white shadow-sm scale-105"
                                        : ((isScrolled || !isHome) ? "text-slate-400 hover:text-slate-900" : "text-white/60 hover:text-white")
                                )}
                            >
                                EN
                            </Link>
                        </div>

                        {!pathname.includes('/book') && (
                            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-full px-6 xl:px-8 py-3 xl:py-6 h-auto shadow-xl hover:shadow-amber-500/20 transition-all active:scale-95 text-xs xl:text-sm">
                                <Link href="/book">{t('hero.cta')}</Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={cn(
                        "lg:hidden p-2 rounded-lg transition-colors",
                        (isScrolled || !isHome) ? "text-slate-900" : "text-white"
                    )}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300 rounded-b-[2rem]">
                    <div className="flex flex-col gap-4">
                        <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-slate-900 border-b pb-2">{t('services').split(' ')[0]}</Link>
                        <Link href="/#vehicles" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-slate-900 border-b pb-2">{t('vehicles')}</Link>
                        <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-slate-900 border-b pb-2">{t('contact')}</Link>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                        <Link
                            href="/"
                            locale="de"
                            className={cn(
                                "flex-1 text-center py-4 rounded-xl text-sm font-black transition-all uppercase",
                                locale === 'de' ? "bg-amber-500 text-white shadow-lg" : "text-slate-400"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Deutsch
                        </Link>
                        <Link
                            href="/"
                            locale="en"
                            className={cn(
                                "flex-1 text-center py-4 rounded-xl text-sm font-black transition-all uppercase",
                                locale === 'en' ? "bg-amber-500 text-white shadow-lg" : "text-slate-400"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            English
                        </Link>
                    </div>

                    <Button asChild className="w-full h-16 bg-slate-900 text-white text-lg font-bold rounded-2xl shadow-xl">
                        <Link href="/book">{t('hero.cta')}</Link>
                    </Button>
                </div>
            )}
        </nav>
    );
}

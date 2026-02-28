"use client";

import { useState } from 'react';
import { Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Car, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
    const t = useTranslations('Index');
    const [currentImage, setCurrentImage] = useState(0);
    const images = vehicle.images && vehicle.images.length > 0
        ? vehicle.images
        : [vehicle.image_url || ''];

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="group bg-slate-50 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl flex flex-col h-full">
            <div className="relative h-72 overflow-hidden bg-slate-200">
                {images[0] ? (
                    <>
                        <img
                            src={images[currentImage]}
                            alt={vehicle.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {images.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={prevImage}
                                    className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "h-1 rounded-full transition-all",
                                        idx === currentImage ? "w-6 bg-amber-500" : "w-2 bg-white/40"
                                    )}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-12 h-12 text-slate-400" />
                    </div>
                )}
                <div className="absolute top-6 right-6">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                        <span className="text-slate-900 font-black text-lg">
                            {vehicle.price_per_hour} <span className="text-[10px] uppercase text-slate-500 tracking-widest">CHF/d</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-10 space-y-6 flex-1 flex flex-col">
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">{vehicle.name}</h3>
                    <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed">{vehicle.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                    {(vehicle.features && vehicle.features.length > 0 ? vehicle.features : ['Premium Audio', 'GPS Navigation', 'AC', 'Automatic']).map((tag) => (
                        <div key={tag} className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Check size={10} className="text-amber-500" /> {tag}
                        </div>
                    ))}
                </div>

                <div className="pt-4 mt-auto">
                    <Button asChild className="w-full h-14 bg-slate-900 hover:bg-amber-500 text-white hover:text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-amber-500/20">
                        <Link href="/book">Book This Fleet</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

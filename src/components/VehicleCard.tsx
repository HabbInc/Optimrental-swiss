"use client";

import { useState } from "react";
import { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Fuel,
  Gauge,
  Calendar,
  Users,
  Snowflake,
  Baby,
  Scale,
  Ruler,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const t = useTranslations("Index");
  const [currentImage, setCurrentImage] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const images =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images
      : [vehicle.image_url || ""];

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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open popup if clicking on book button or image navigation
    if (
      (e.target as HTMLElement).closest("a") ||
      (e.target as HTMLElement).closest("button")
    ) {
      return;
    }
    setIsDetailOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-slate-50 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl flex flex-col h-full cursor-pointer"
      >
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
                      idx === currentImage
                        ? "w-6 bg-amber-500"
                        : "w-2 bg-white/40",
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
                {vehicle.price_per_hour}{" "}
                <span className="text-[10px] uppercase text-slate-500 tracking-widest">
                  CHF/d
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-6 flex-1 flex flex-col">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">
              {vehicle.name}
            </h3>
            <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {(vehicle.features && vehicle.features.length > 0
              ? vehicle.features
              : ["Premium Audio", "GPS Navigation", "AC", "Automatic"]
            ).map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest"
              >
                <Check size={10} className="text-amber-500" /> {tag}
              </div>
            ))}
          </div>

          <div className="pt-4 mt-auto">
            <Button
              asChild
              className="w-full h-14 bg-slate-900 hover:bg-amber-500 text-white hover:text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-amber-500/20"
            >
              <Link href="/book">Book This Fleet</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Vehicle Details Popup */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="rounded-3xl max-w-4xl p-0 border-none overflow-hidden sm:rounded-3xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            {/* Image Gallery */}
            <div className="relative h-80 bg-slate-200">
              {images[0] ? (
                <>
                  <img
                    src={images[currentImage]}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <button
                        onClick={prevImage}
                        className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          idx === currentImage
                            ? "w-8 bg-amber-500"
                            : "w-2 bg-white/60",
                        )}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="w-20 h-20 text-slate-400" />
                </div>
              )}
              <div className="absolute top-6 right-6">
                <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-full shadow-lg">
                  <span className="text-slate-900 font-black text-xl">
                    {vehicle.price_per_hour}{" "}
                    <span className="text-xs uppercase text-slate-500 tracking-widest">
                      CHF/day
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <DialogTitle className="text-3xl font-black text-slate-900">
                  {vehicle.name}
                </DialogTitle>
                {(vehicle.manufacturer || vehicle.model) && (
                  <p className="text-lg text-amber-600 font-bold">
                    {vehicle.manufacturer} {vehicle.model}{" "}
                    {vehicle.year && `(${vehicle.year})`}
                  </p>
                )}
                <p className="text-slate-500 text-base leading-relaxed">
                  {vehicle.description}
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {(vehicle.features && vehicle.features.length > 0
                  ? vehicle.features
                  : ["Premium Audio", "GPS Navigation", "AC", "Automatic"]
                ).map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600 uppercase tracking-widest"
                  >
                    <Check size={12} className="text-amber-500" /> {tag}
                  </div>
                ))}
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {vehicle.seat_count && (
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Users size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Seats
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {vehicle.seat_count}
                    </p>
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Gauge size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Transmission
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {vehicle.transmission}
                    </p>
                  </div>
                )}
                {vehicle.fuel_type && (
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Fuel size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Fuel Type
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {vehicle.fuel_type}
                    </p>
                  </div>
                )}
                {vehicle.year && (
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Calendar size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Year
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {vehicle.year}
                    </p>
                  </div>
                )}
                {vehicle.euro_class && (
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Check size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Emission Class
                      </span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {vehicle.euro_class}
                    </p>
                  </div>
                )}
              </div>

              {/* Dimensions */}
              {(vehicle.width ||
                vehicle.length ||
                vehicle.height ||
                vehicle.curb_weight ||
                vehicle.max_gross_weight) && (
                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                    <Ruler size={14} /> Dimensions & Weight
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {vehicle.length && (
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                          Length
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {vehicle.length} cm
                        </p>
                      </div>
                    )}
                    {vehicle.width && (
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                          Width
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {vehicle.width} cm
                        </p>
                      </div>
                    )}
                    {vehicle.height && (
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                          Height
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {vehicle.height} cm
                        </p>
                      </div>
                    )}
                    {vehicle.curb_weight && (
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                          Curb Weight
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {vehicle.curb_weight} kg
                        </p>
                      </div>
                    )}
                    {vehicle.max_gross_weight && (
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                          Max Weight
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {vehicle.max_gross_weight} kg
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Winter & Safety Features */}
              {(vehicle.winter_ready ||
                vehicle.winter_tires ||
                vehicle.studded_tires ||
                vehicle.child_seat_space) && (
                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                    <Snowflake size={14} /> Winter & Safety
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {vehicle.winter_ready && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                        <Snowflake size={14} /> Winter Ready
                      </div>
                    )}
                    {vehicle.winter_tires && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                        <Check size={14} /> Winter Tires
                      </div>
                    )}
                    {vehicle.studded_tires && (
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                        <Check size={14} /> Studded Tires
                      </div>
                    )}
                    {vehicle.child_seat_space && (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                        <Baby size={14} /> Child Seat Space
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Book Button */}
              <div className="pt-6">
                <Button
                  asChild
                  className="w-full h-14 bg-slate-900 hover:bg-amber-500 text-white hover:text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-amber-500/20 text-lg"
                >
                  <Link href="/book">Book This Vehicle</Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

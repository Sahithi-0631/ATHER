import React, { useState, useEffect } from 'react';
import { X, Zap, Clock, ShieldCheck, MapPin, CheckCircle, ArrowRight, Phone } from 'lucide-react';

export default function LockChargerModal({ station, selectedVehicle, soc, isOpen, onClose }) {
  const [countdown, setCountdown] = useState(900); // 15:00 minutes hold
  const [token] = useState(() => 'VG-' + Math.floor(100000 + Math.random() * 900000));
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !station) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl max-w-md w-full p-5 shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs uppercase font-mono-telemetry font-bold text-emerald-400 tracking-wider">
                Charging Gun Reserved
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h3 className="text-lg font-bold text-white font-chakra">
              {station.name}
            </h3>
          </div>
        </div>

        {/* Reservation Countdown Pill */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-950 p-3.5 rounded-xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Slot Hold Window
            </div>
            <div className="text-2xl font-bold font-mono-telemetry text-emerald-400 tracking-wider mt-0.5">
              {formattedTime}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Passcode Token</div>
            <div className="text-base font-bold font-mono-telemetry text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {token}
            </div>
          </div>
        </div>

        {/* Gun & Vehicle Compatibility Specs */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Reserved For:</span>
            <span className="font-semibold text-white">{selectedVehicle.name} ({selectedVehicle.type})</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Power Output:</span>
            <span className="font-mono-telemetry text-cyan-300">{station.power}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Station Distance:</span>
            <span className="font-mono-telemetry text-slate-200">{station.distanceKm} km (~{station.etaMinutes} mins)</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Estimated Battery at Arrival:</span>
            <span className="font-mono-telemetry text-emerald-400 font-bold">{station.arrivalSoc}% SOC</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Rate Tariff:</span>
            <span className="text-slate-200">{station.pricing}</span>
          </div>
        </div>

        {/* Address & Navigation */}
        <div className="text-xs text-slate-400 flex items-start space-x-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{station.address}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Start Live Turn-By-Turn Navigation</span>
          </a>
          {station.phone && (
            <a
              href={`tel:${station.phone}`}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 flex items-center justify-center"
              title="Call Station Attendant"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


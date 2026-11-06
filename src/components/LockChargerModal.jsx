import React, { useState, useEffect } from 'react';
import { X, Zap, Clock, ShieldCheck, MapPin, CheckCircle, ArrowRight, Phone } from 'lucide-react';

export default function LockChargerModal({ station, selectedVehicle, soc, isOpen, onClose }) {
  const [countdown, setCountdown] = useState(900); // 15:00 minutes hold
  const [token] = useState(() => 'VG-' + Math.floor(100000 + Math.random() * 900000));

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1324] border border-cyan-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 glow-cyan">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 glow-cyan">
            <Zap className="w-6 h-6 animate-pulse fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono-telemetry font-bold text-cyan-300 tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/80">
                Gun Lock Active
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h3 className="text-lg font-bold text-white font-chakra mt-1">
              {station.name}
            </h3>
          </div>
        </div>

        {/* Reservation Countdown Pill */}
        <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-950 p-4 rounded-2xl border border-cyan-500/40 flex items-center justify-between shadow-inner">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Slot Guaranteed Hold
            </div>
            <div className="text-3xl font-extrabold font-mono-telemetry text-cyan-300 tracking-wider mt-0.5">
              {formattedTime}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Digital Token</div>
            <div className="text-base font-bold font-mono-telemetry text-white bg-slate-800 px-3 py-1 rounded-xl border border-slate-700 mt-1 shadow-sm">
              {token}
            </div>
          </div>
        </div>

        {/* Gun & Vehicle Compatibility Specs */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Reserved Vehicle:</span>
            <span className="font-semibold text-white">{selectedVehicle.name} ({selectedVehicle.type})</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Power Rating:</span>
            <span className="font-mono-telemetry text-cyan-300 font-semibold">{station.power}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Distance & ETA:</span>
            <span className="font-mono-telemetry text-white">{station.distanceKm} km (~{station.etaMinutes} mins)</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Predicted Arrival SOC:</span>
            <span className="font-mono-telemetry text-emerald-400 font-bold">~{station.arrivalSoc}% SOC</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Standard Tariff:</span>
            <span className="text-slate-200 font-mono-telemetry">{station.pricing}</span>
          </div>
        </div>

        {/* Address */}
        <div className="text-xs text-slate-400 flex items-start space-x-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{station.address}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/25 uppercase tracking-wider"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Launch Cockpit GPS</span>
          </a>
          {station.phone && (
            <a
              href={`tel:${station.phone}`}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 flex items-center justify-center transition-colors"
              title="Call Station Attendant"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

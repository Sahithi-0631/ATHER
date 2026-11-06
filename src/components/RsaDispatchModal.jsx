import React, { useState } from 'react';
import { X, PhoneCall, ShieldAlert, Wrench, AlertTriangle, CheckCircle2, Radio, MapPin, Truck } from 'lucide-react';
import { USER_LOCATION } from '../data/vehicles';

export default function RsaDispatchModal({
  mechanic,
  selectedVehicle,
  soc,
  safeRangeKm,
  isOpen,
  onClose
}) {
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen || !mechanic) return null;

  const is4W = selectedVehicle.type === '4W';
  const dispatchTitle = is4W 
    ? 'Certified EV Flatbed Towing Protocol' 
    : '2W Mobile EV Roadside Repair & Pickup';

  const handleSimulateDispatch = () => {
    setIsDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-red-500/80 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-red-600/20 border border-red-500/50 text-red-400">
            {is4W ? <Truck className="w-6 h-6" /> : <Wrench className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-mono-telemetry font-bold text-red-400 tracking-wider">
                Emergency EV Triage Handshake
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                CRITICAL
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-chakra">
              {dispatchTitle}
            </h3>
          </div>
        </div>

        {/* Critical Mechanical Triage Warning */}
        <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
          is4W
            ? 'bg-red-950/40 border-red-700/60 text-red-200'
            : 'bg-amber-950/40 border-amber-700/60 text-amber-200'
        }`}>
          <div className="flex items-center space-x-1.5 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              {is4W ? 'ENGINEERING WARNING: WHEEL-TOWING FORBIDDEN' : '2W COMPONENT TRIAGE PROTOCOL'}
            </span>
          </div>
          <p className="text-[11px] text-slate-200/90">
            {mechanic.triage_note}
          </p>
        </div>

        {/* Unit Info */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Responding Provider:</span>
            <span className="font-semibold text-white">{mechanic.name}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Equipment Type:</span>
            <span className="font-mono-telemetry text-cyan-300">{mechanic.power}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Response Distance:</span>
            <span className="font-mono-telemetry text-slate-200">{mechanic.distanceKm} km (Est. arrival: {mechanic.etaMinutes} mins)</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Pricing / Coverage:</span>
            <span className="text-emerald-400 font-medium">{mechanic.pricing}</span>
          </div>
        </div>

        {/* Telemetry Payload Transmission preview */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono-telemetry space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Transmitted GPS & Telemetry Packet</span>
            </span>
            <span className="text-emerald-400">ENCRYPTED</span>
          </div>
          <div className="text-slate-300 pt-1">
            LOC: {USER_LOCATION.lat}° N, {USER_LOCATION.lng}° E ({USER_LOCATION.name})
          </div>
          <div className="text-slate-300">
            VEHICLE: {selectedVehicle.name} | SOC: {soc}% | REMAINING: {safeRangeKm} km
          </div>
        </div>

        {/* Dispatched state confirmation */}
        {isDispatched ? (
          <div className="bg-emerald-950/50 border border-emerald-500/60 p-3 rounded-xl flex items-center space-x-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold">Emergency Unit Dispatched!</div>
              <div className="text-[11px] text-emerald-300/80">
                Driver acknowledged telemetry. Live tracking link sent via SMS.
              </div>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          {/* Direct Phone Call */}
          <a
            href={`tel:${mechanic.phone}`}
            className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-red-600/40"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Call Driver ({mechanic.phone})</span>
          </a>

          {/* Simulate App Dispatch */}
          {!isDispatched && (
            <button
              onClick={handleSimulateDispatch}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              1-Tap Dispatch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


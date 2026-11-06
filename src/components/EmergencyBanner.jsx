import React from 'react';
import { AlertTriangle, Zap, PhoneCall, ShieldAlert, ArrowRight, Truck, Wrench } from 'lucide-react';

export default function EmergencyBanner({
  soc,
  safeRangeKm,
  selectedVehicle,
  nearestFastCharger,
  nearestRsa,
  onLockNearestCharger,
  onCallRsa
}) {
  const is4W = selectedVehicle.type === '4W';
  const rsaTitle = is4W ? 'Call Flatbed RSA' : 'Call 2W Mobile RSA';

  return (
    <div className="bg-gradient-to-r from-red-950/95 via-rose-900/90 to-red-950/95 border border-red-500/80 rounded-2xl p-4 sm:p-5 shadow-[0_0_35px_rgba(255,51,102,0.45)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-300 relative overflow-hidden">
      {/* Top glowing laser line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-red-500 animate-pulse" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Alert Icon & Description */}
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-2xl bg-red-600 text-white shrink-0 mt-0.5 animate-bounce shadow-xl shadow-red-600/60 border border-red-400">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap">
              <span className="font-chakra font-extrabold text-lg sm:text-xl text-white uppercase tracking-wider flex items-center gap-2">
                CRITICAL BATTERY EMERGENCY (SOC {soc}%)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-telemetry font-bold bg-black/60 text-red-300 border border-red-500/60 animate-pulse">
                LIMP MODE IMMINENT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-red-100/90 mt-1 max-w-2xl leading-relaxed">
              Safe reachability reduced to <strong className="text-white underline font-mono-telemetry font-bold">{safeRangeKm} km</strong>.
              {is4W ? (
                <> Mandatory Flatbed Protocol: Wheel-towing permanently destroys permanent-magnet motor inverters.</>
              ) : (
                <> Rapid 2W Roadside Triage active for urgent belt snap, throttle, or battery pickup.</>
              )}
            </p>

            {/* Nearest fast charger hint */}
            {nearestFastCharger && (
              <div className="mt-2.5 flex items-center space-x-2 text-xs text-red-200">
                <Zap className="w-4 h-4 text-amber-300 shrink-0 fill-current" />
                <span>
                  Immediate Target: <strong className="text-white font-semibold">{nearestFastCharger.name}</strong> ({nearestFastCharger.distanceKm} km away &bull; ~{nearestFastCharger.etaMinutes}m ETA)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Urgent One-Tap Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
          {/* Action 1: Lock Nearest Fast Charger */}
          <button
            type="button"
            onClick={onLockNearestCharger}
            disabled={!nearestFastCharger}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition-all duration-150 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            <Zap className="w-4 h-4 fill-current text-slate-950" />
            <span className="whitespace-nowrap">Lock Nearest Fast Charger</span>
          </button>

          {/* Action 2: Call RSA (Flatbed for 4W / Mobile for 2W) */}
          <button
            type="button"
            onClick={onCallRsa}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-600/50 border border-red-400/80 transition-all duration-150 hover:scale-[1.02] animate-pulse uppercase tracking-wider"
          >
            {is4W ? <Truck className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
            <span className="whitespace-nowrap">{rsaTitle}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

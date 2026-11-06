import React from 'react';
import { AlertTriangle, Zap, PhoneCall, ShieldAlert, Navigation, ArrowRight } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-y sm:border sm:rounded-2xl border-red-500/80 p-4 shadow-2xl shadow-red-950/80 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Alert Icon & Description */}
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 mt-0.5 animate-bounce shadow-lg shadow-red-600/50">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-chakra font-bold text-base sm:text-lg text-white uppercase tracking-wide">
                CRITICAL BATTERY EMERGENCY (SOC {soc}%)
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono-telemetry bg-black/40 text-red-300 border border-red-500/50">
                LIMP MODE IMMINENT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-red-100/90 mt-1 max-w-2xl leading-relaxed">
              Safe reachability reduced to <strong className="text-white underline font-mono-telemetry">{safeRangeKm} km</strong>.
              {is4W ? (
                <> Strict EV Flatbed Protocol active to prevent motor inverter damage from wheel-drag towing.</>
              ) : (
                <> Low-voltage 2W roadside triage active for rapid belt/battery pickup.</>
              )}
            </p>

            {/* Nearest fast charger hint */}
            {nearestFastCharger && (
              <div className="mt-2 flex items-center space-x-2 text-xs text-red-200">
                <Zap className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span>
                  Closest Target: <strong className="text-white">{nearestFastCharger.name}</strong> ({nearestFastCharger.distanceKm} km away)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Urgent One-Tap Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
          {/* Action 1: Lock Nearest Fast Charger */}
          <button
            onClick={onLockNearestCharger}
            disabled={!nearestFastCharger}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span className="whitespace-nowrap">Lock Nearest Fast Charger</span>
          </button>

          {/* Action 2: Call RSA (Flatbed for 4W / Mobile for 2W) */}
          <button
            onClick={onCallRsa}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-600/40 border border-red-400/50 transition-all hover:scale-[1.02] animate-pulse"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="whitespace-nowrap">{rsaTitle}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


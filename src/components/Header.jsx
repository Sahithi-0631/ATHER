import React from 'react';
import { BatteryCharging, AlertTriangle, ShieldCheck, Radio, Sparkles, Zap, Navigation } from 'lucide-react';

export default function Header({
  selectedVehicle,
  soc,
  safeRangeKm,
  isCritical,
  onEmergencyTrigger
}) {
  return (
    <header className={`border-b transition-all duration-300 ${
      isCritical 
        ? 'bg-red-950/70 border-red-500/50 text-red-50 shadow-[0_4px_30px_rgba(255,51,102,0.25)]' 
        : 'bg-[#070b14]/85 border-slate-800/80 text-slate-100 backdrop-blur-2xl'
    } sticky top-0 z-40 px-4 py-3 sm:px-6 sm:py-3.5`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Cockpit Header */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3.5">
            {/* Glowing Cyan Battery Cockpit Icon */}
            <div className={`p-2.5 rounded-2xl border flex items-center justify-center transition-all ${
              isCritical
                ? 'bg-red-500/20 border-red-400 text-red-400 glow-coral animate-pulse'
                : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 glow-cyan'
            }`}>
              <BatteryCharging className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl font-bold tracking-tight font-chakra text-white flex items-center gap-1.5">
                  Ather
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </span>
                <span className="text-[10px] font-medium font-mono-telemetry tracking-widest px-2.5 py-0.5 rounded-full bg-slate-800/90 text-cyan-300 border border-slate-700/80 shadow-inner">
                  v2.4 Telemetry
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block mt-0.5">
                Automotive Reachability & Emergency Triage Cockpit (2W + 4W)
              </p>
            </div>
          </div>

          {/* Mobile Critical Badge */}
          {isCritical && (
            <div className="md:hidden flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/70 text-red-200 text-xs font-semibold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>SOC &le; 15%</span>
            </div>
          )}
        </div>

        {/* Real-time Telemetry Pill Strip */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-end text-xs font-mono-telemetry">
          {/* Active Vehicle Pill */}
          <div className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-sm backdrop-blur-md">
            <span className="text-base">{selectedVehicle.image}</span>
            <div className="text-left">
              <div className="text-[9px] text-slate-400 uppercase tracking-widest leading-none font-medium">
                {selectedVehicle.type} PROFILE
              </div>
              <div className="font-semibold text-white text-[12px] truncate max-w-[130px] sm:max-w-[160px] leading-tight mt-0.5">
                {selectedVehicle.name}
              </div>
            </div>
          </div>

          {/* SOC & Range Pill */}
          <div className={`flex items-center space-x-3 px-3.5 py-1.5 rounded-full border transition-all backdrop-blur-md ${
            isCritical
              ? 'bg-red-950/60 border-red-500/80 text-red-100 glow-coral shadow-lg'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-200'
          }`}>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">SOC</span>
              <span className={`font-bold text-sm mt-0.5 ${isCritical ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                {soc}%
              </span>
            </div>
            <div className="h-5 w-px bg-slate-700/80" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">Safe Range</span>
              <span className="font-bold text-sm text-cyan-300 mt-0.5">
                {safeRangeKm} <span className="text-[10px] font-normal text-slate-400">km</span>
              </span>
            </div>
          </div>

          {/* GPS Corridor Lock Pill */}
          <div className="hidden lg:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <div className="leading-none">
              <div className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">GPS LOCK</div>
              <div className="text-[11px] font-medium text-slate-200 mt-0.5">NH-44 Kurnool (15.828° N, 78.037° E)</div>
            </div>
          </div>

          {/* Protocol Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] text-slate-300 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium text-cyan-200">
              {selectedVehicle.type === '4W' ? 'CCS2 / Flatbed' : '16A / Mobile 2W'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

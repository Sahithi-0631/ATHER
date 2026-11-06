import React from 'react';
import { Zap, AlertTriangle, ShieldCheck, Radio, Navigation, Compass } from 'lucide-react';

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
        ? 'bg-red-950/80 border-red-600/50 text-red-50' 
        : 'bg-slate-900/90 border-slate-800 text-slate-100'
    } backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors shadow-lg ${
              isCritical 
                ? 'bg-red-600 border-red-400 text-white shadow-red-500/30 animate-pulse' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
            }`}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold tracking-tight font-chakra text-white">
                  Ather
                </span>
                <span className="text-[10px] uppercase font-mono-telemetry tracking-widest px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  v2.4 Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Smart EV Reachability & Emergency Triage Platform (2W + 4W)
              </p>
            </div>
          </div>

          {/* Mobile Critical Badge */}
          {isCritical && (
            <div className="md:hidden flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-600/30 border border-red-500 text-red-200 text-xs font-semibold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOC &le; 15%</span>
            </div>
          )}
        </div>

        {/* Real-time Telemetry Pill Strip */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end text-xs font-mono-telemetry">
          {/* Active Vehicle Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
            <span className="text-base">{selectedVehicle.image}</span>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{selectedVehicle.type} Profile</div>
              <div className="font-semibold text-slate-200 truncate max-w-[120px] sm:max-w-[150px]">
                {selectedVehicle.name}
              </div>
            </div>
          </div>

          {/* SOC & Range Pill */}
          <div className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border transition-all ${
            isCritical
              ? 'bg-red-900/40 border-red-500 text-red-100 shadow-md shadow-red-500/20'
              : 'bg-slate-800/80 border-slate-700/80 text-slate-200'
          }`}>
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Battery SOC</span>
              <span className={`font-bold text-sm ${isCritical ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                {soc}%
              </span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Safe Range</span>
              <span className="font-bold text-sm text-cyan-300">
                {safeRangeKm} <span className="text-[10px] font-normal text-slate-400">km</span>
              </span>
            </div>
          </div>

          {/* GPS Corridor Lock Pill */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-400">GPS ANCHOR</div>
              <div className="text-[11px] font-medium text-slate-200">NH-44 Kurnool (15.828° N, 78.037° E)</div>
            </div>
          </div>

          {/* Protocol Badge */}
          <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-[11px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-blue-300">
              {selectedVehicle.type === '4W' ? 'CCS2 / Flatbed Safe' : '16A / Mobile 2W Safe'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}


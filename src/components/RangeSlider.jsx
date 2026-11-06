import React from 'react';
import { BatteryCharging, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export default function RangeSlider({
  soc,
  onSocChange,
  safeRangeKm,
  selectedVehicle,
  isCritical
}) {
  const usableKwh = Math.max(0, (((soc - 2) / 100) * selectedVehicle.batteryCapacity)).toFixed(2);
  const reserveKwh = ((2 / 100) * selectedVehicle.batteryCapacity).toFixed(2);

  // Quick preset shortcuts requested: 10%, 15%, 35%, 85%, 100%
  const presets = [10, 15, 35, 85, 100];

  const getSocColor = () => {
    if (soc <= 15) return 'text-red-400';
    if (soc <= 30) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getProgressGradient = () => {
    if (soc <= 15) return 'from-red-600 to-rose-500 shadow-[0_0_15px_rgba(255,51,102,0.6)]';
    if (soc <= 30) return 'from-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    return 'from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]';
  };

  return (
    <div className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 backdrop-blur-xl shadow-2xl ${
      isCritical 
        ? 'bg-red-950/40 border-red-500/60 shadow-[0_0_30px_rgba(255,51,102,0.3)] ring-1 ring-red-500/40' 
        : 'bg-slate-900/60 border-slate-700/40'
    }`}>
      {/* Header and Live Range Display */}
      <div className="flex items-start justify-between mb-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
              Cockpit Battery SOC Meter
            </span>
            {isCritical && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600/30 text-red-300 border border-red-500/60 animate-pulse glow-coral">
                CRITICAL LIMP
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            BMS 2% deep-discharge cell buffer automatically deducted
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-baseline space-x-1 justify-end">
            <span className={`text-3xl font-extrabold font-mono-telemetry tracking-tight ${getSocColor()}`}>
              {soc}
            </span>
            <span className="text-sm font-bold text-slate-400 font-mono-telemetry">%</span>
          </div>
          <div className="text-xs font-mono-telemetry text-cyan-300 font-semibold mt-0.5">
            &asymp; {safeRangeKm} km safe
          </div>
        </div>
      </div>

      {/* Horizontal Range Slider with Glowing Track */}
      <div className="relative my-4">
        {/* Progress Background bar */}
        <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${getProgressGradient()} transition-all duration-150 rounded-full`}
            style={{ width: `${Math.min(100, Math.max(3, soc))}%` }}
          />
          {/* 15% Critical Threshold Divider Line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 opacity-80"
            style={{ left: '15%' }}
            title="15% Critical Limp Mode Threshold"
          />
        </div>

        {/* Real Range Input with smooth slider control */}
        <input
          type="range"
          min="3"
          max="100"
          step="1"
          value={soc}
          onChange={(e) => onSocChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-3.5 opacity-0 cursor-pointer z-20"
        />

        {/* Range Label Markers */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono-telemetry mt-2 px-1">
          <span>3% (Min)</span>
          <span className="text-red-400 font-semibold">15% (Critical Alert)</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Preset Buttons lighting up when active */}
      <div className="flex items-center justify-between gap-1.5 mt-3 pt-3 border-t border-slate-800/70">
        <span className="text-[10px] uppercase font-mono-telemetry text-slate-400 tracking-wider">Quick Presets:</span>
        <div className="flex gap-1.5">
          {presets.map((p) => {
            const isActive = soc === p;
            const isEmergencyPreset = p <= 15;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onSocChange(p)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono-telemetry font-bold transition-all duration-200 ${
                  isActive
                    ? isEmergencyPreset
                      ? 'bg-red-600 text-white shadow-lg glow-coral border border-red-400 scale-105'
                      : 'bg-emerald-500 text-slate-950 shadow-lg glow-emerald border border-emerald-300 scale-105'
                    : isEmergencyPreset
                    ? 'bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-800/40'
                    : 'bg-slate-800/90 hover:bg-slate-700/80 text-slate-300 border border-slate-700/70'
                }`}
              >
                {p}%
              </button>
            );
          })}
        </div>
      </div>

      {/* Mathematical Breakdown Cockpit Panel */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80 shadow-sm">
          <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Net Usable</div>
          <div className="font-mono-telemetry font-bold text-white mt-1 text-sm">
            {usableKwh} <span className="text-[10px] font-normal text-slate-400">kWh</span>
          </div>
        </div>
        <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80 shadow-sm">
          <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">2% Reserve Buffer</div>
          <div className="font-mono-telemetry font-bold text-amber-400 mt-1 text-sm">
            {reserveKwh} <span className="text-[10px] font-normal text-slate-400">kWh</span>
          </div>
        </div>
        <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800/80 shadow-sm">
          <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Burn Rate</div>
          <div className="font-mono-telemetry font-bold text-cyan-300 mt-1 text-sm">
            {selectedVehicle.consumption} <span className="text-[9px] font-normal text-slate-400">kWh/km</span>
          </div>
        </div>
      </div>
    </div>
  );
}

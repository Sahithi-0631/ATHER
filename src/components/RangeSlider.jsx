import React from 'react';
import { BatteryCharging, AlertOctagon, ShieldAlert, Cpu } from 'lucide-react';

export default function RangeSlider({
  soc,
  onSocChange,
  safeRangeKm,
  selectedVehicle,
  isCritical
}) {
  const usableKwh = Math.max(0, (((soc - 2) / 100) * selectedVehicle.batteryCapacity)).toFixed(2);
  const reserveKwh = ((2 / 100) * selectedVehicle.batteryCapacity).toFixed(2);

  // Quick preset shortcuts
  const presets = [10, 15, 35, 60, 85, 100];

  const getSocColor = () => {
    if (soc <= 15) return 'text-red-400';
    if (soc <= 30) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getProgressColor = () => {
    if (soc <= 15) return 'from-red-600 to-red-500';
    if (soc <= 30) return 'from-amber-500 to-amber-400';
    return 'from-emerald-500 to-teal-400';
  };

  return (
    <div className={`rounded-2xl p-4 border transition-all duration-300 shadow-xl backdrop-blur-md ${
      isCritical 
        ? 'bg-red-950/40 border-red-600/60 shadow-red-950/50 ring-1 ring-red-500/30' 
        : 'bg-slate-900/90 border-slate-800'
    }`}>
      {/* Header and Live Range Display */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              State of Charge (SOC)
            </span>
            {isCritical && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600/30 text-red-300 border border-red-500/50 animate-pulse">
                CRITICAL
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            BMS 2% deep-discharge reserve auto-deducted
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-baseline space-x-1 justify-end">
            <span className={`text-2xl font-bold font-mono-telemetry ${getSocColor()}`}>
              {soc}
            </span>
            <span className="text-xs font-medium text-slate-400">%</span>
          </div>
          <div className="text-[11px] font-mono-telemetry text-cyan-300 font-semibold">
            &asymp; {safeRangeKm} km safe
          </div>
        </div>
      </div>

      {/* Custom Slider with Styled Track */}
      <div className="relative my-4">
        {/* Progress Background bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-150`}
            style={{ width: `${Math.min(100, Math.max(3, soc))}%` }}
          />
          {/* 15% Critical Threshold Marker */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 opacity-70"
            style={{ left: '15%' }}
            title="15% Critical Emergency Threshold"
          />
        </div>

        {/* Real Range Input */}
        <input
          type="range"
          min="3"
          max="100"
          step="1"
          value={soc}
          onChange={(e) => onSocChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer z-20"
        />

        {/* Range Label Markers */}
        <div className="flex justify-between text-[10px] text-slate-500 font-mono-telemetry mt-1.5 px-0.5">
          <span>3% (Min)</span>
          <span className="text-red-400 font-medium">15% (Crit)</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center justify-between gap-1 mt-3">
        <span className="text-[10px] uppercase font-mono-telemetry text-slate-400 tracking-wider">Presets:</span>
        <div className="flex gap-1.5">
          {presets.map((p) => {
            const isActive = soc === p;
            const isEmergencyPreset = p <= 15;
            return (
              <button
                key={p}
                onClick={() => onSocChange(p)}
                className={`px-2 py-1 rounded text-[11px] font-mono-telemetry transition-all ${
                  isActive
                    ? isEmergencyPreset
                      ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30 ring-1 ring-red-400'
                      : 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                    : isEmergencyPreset
                    ? 'bg-red-950/40 text-red-300 hover:bg-red-900/60 border border-red-800/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                {p}%
              </button>
            );
          })}
        </div>
      </div>

      {/* Mathematical Breakdown HUD */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
          <div className="text-[10px] text-slate-400 font-medium uppercase">Usable Energy</div>
          <div className="font-mono-telemetry font-bold text-slate-200 mt-0.5">
            {usableKwh} <span className="text-[10px] font-normal text-slate-400">kWh</span>
          </div>
        </div>
        <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
          <div className="text-[10px] text-slate-400 font-medium uppercase">2% Reserve Buffer</div>
          <div className="font-mono-telemetry font-bold text-amber-400/90 mt-0.5">
            {reserveKwh} <span className="text-[10px] font-normal text-slate-400">kWh</span>
          </div>
        </div>
        <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800/60">
          <div className="text-[10px] text-slate-400 font-medium uppercase">Burn Rate</div>
          <div className="font-mono-telemetry font-bold text-cyan-300 mt-0.5">
            {selectedVehicle.consumption} <span className="text-[9px] font-normal text-slate-400">kWh/km</span>
          </div>
        </div>
      </div>
    </div>
  );
}


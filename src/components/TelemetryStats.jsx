import React from 'react';
import { Gauge, BatteryCharging, Zap, MapPin, Compass, ArrowUpRight } from 'lucide-react';

export default function TelemetryStats({
  selectedVehicle,
  soc,
  safeRangeKm,
  isCritical,
  stations
}) {
  const reachableCount = stations.filter(st => st.distanceKm <= safeRangeKm).length;
  const closestStation = stations[0]; // sorted by distance

  const usableKwh = Math.max(0, (((soc - 2) / 100) * selectedVehicle.batteryCapacity)).toFixed(1);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* Stat 1: Safe Reachability */}
      <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 relative overflow-hidden ${
        isCritical 
          ? 'bg-red-950/40 border-red-500/60 shadow-[0_0_25px_rgba(255,51,102,0.25)]' 
          : 'bg-slate-900/60 border-slate-700/40 shadow-2xl hover:border-cyan-500/40'
      }`}>
        {/* Subtle accent gradient top line */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          isCritical 
            ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse' 
            : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400'
        }`} />

        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="uppercase tracking-widest font-semibold text-[11px] text-slate-300">
            Safe Reachability
          </span>
          <div className={`p-1.5 rounded-xl border ${
            isCritical ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}>
            <Gauge className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono-telemetry text-transparent bg-clip-text ${
            isCritical 
              ? 'bg-gradient-to-r from-red-400 via-rose-300 to-red-500' 
              : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400'
          }`}>
            {safeRangeKm}
          </span>
          <span className="text-sm font-bold font-mono-telemetry text-slate-400 uppercase">
            km
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 font-mono-telemetry border border-slate-700/60">
            {selectedVehicle.consumption} kWh/km
          </span>
          <span className="text-slate-400 text-[10px]">
            Formula: ((SOC-2%)&times;Cap)&divide;Cons
          </span>
        </div>
      </div>

      {/* Stat 2: Usable Energy & Buffer */}
      <div className="p-4 rounded-2xl border bg-slate-900/60 border-slate-700/40 backdrop-blur-xl shadow-2xl hover:border-emerald-500/40 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="uppercase tracking-widest font-semibold text-[11px] text-slate-300">
            Net Usable Energy
          </span>
          <div className="p-1.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            <BatteryCharging className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono-telemetry text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            {usableKwh}
          </span>
          <span className="text-sm font-bold font-mono-telemetry text-slate-400 uppercase">
            kWh
          </span>
          <span className="text-xs text-slate-500 font-mono-telemetry">
            / {selectedVehicle.batteryCapacity} kWh
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 font-mono-telemetry border border-emerald-800/60 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>2% BMS Buffer Safe</span>
          </span>
          <span className="text-slate-400 text-[10px]">
            No Deep-Drain
          </span>
        </div>
      </div>

      {/* Stat 3: Reachable Infrastructure */}
      <div className="p-4 rounded-2xl border bg-slate-900/60 border-slate-700/40 backdrop-blur-xl shadow-2xl hover:border-cyan-500/40 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="uppercase tracking-widest font-semibold text-[11px] text-slate-300">
            Reachable Hubs
          </span>
          <div className="p-1.5 rounded-xl border bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono-telemetry text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-400">
            {reachableCount}
          </span>
          <span className="text-sm font-bold font-mono-telemetry text-slate-400 uppercase">
            Hubs
          </span>
          <span className="text-xs text-slate-500 font-mono-telemetry">
            / {stations.length} compatible
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className={`px-2 py-0.5 rounded-full font-mono-telemetry border ${
            reachableCount > 0 
              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60' 
              : 'bg-red-950/70 text-red-300 border-red-800/60'
          }`}>
            {reachableCount > 0 ? 'Optimal Route Safe' : 'Corridor Alert'}
          </span>
          <span className="text-slate-400 text-[10px]">
            NH-44 Corridor
          </span>
        </div>
      </div>

      {/* Stat 4: Closest Anchor Target */}
      <div className="p-4 rounded-2xl border bg-slate-900/60 border-slate-700/40 backdrop-blur-xl shadow-2xl hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="uppercase tracking-widest font-semibold text-[11px] text-slate-300">
            Nearest Target
          </span>
          <div className="p-1.5 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-400">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        {closestStation ? (
          <>
            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono-telemetry text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                {closestStation.distanceKm}
              </span>
              <span className="text-sm font-bold font-mono-telemetry text-slate-400 uppercase">
                km
              </span>
              <span className="text-xs text-amber-300/80 font-mono-telemetry font-semibold">
                (~{closestStation.etaMinutes}m ETA)
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="truncate max-w-[150px] text-slate-300 font-medium">
                {closestStation.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-amber-300 font-mono-telemetry border border-slate-700/60 text-[10px]">
                {closestStation.power.split('+')[0]}
              </span>
            </div>
          </>
        ) : (
          <div className="mt-4 text-xs text-slate-500">None in corridor</div>
        )}
      </div>
    </div>
  );
}

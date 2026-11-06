import React from 'react';
import { Gauge, BatteryCharging, Zap, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';

export default function TelemetryStats({
  selectedVehicle,
  soc,
  safeRangeKm,
  isCritical,
  stations
}) {
  const reachableCount = stations.filter(st => st.distanceKm <= safeRangeKm).length;
  const closestStation = stations[0]; // sorted by distance

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Stat 1: Safe Range */}
      <div className={`p-3.5 rounded-xl border backdrop-blur-md transition-all ${
        isCritical 
          ? 'bg-red-950/50 border-red-600/60 shadow-lg shadow-red-950/40' 
          : 'bg-slate-900/80 border-slate-800'
      }`}>
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="uppercase tracking-wider font-semibold">Safe Reachability</span>
          <Gauge className={`w-4 h-4 ${isCritical ? 'text-red-400' : 'text-emerald-400'}`} />
        </div>
        <div className="mt-1.5 flex items-baseline space-x-1.5">
          <span className={`text-2xl font-bold font-mono-telemetry ${
            isCritical ? 'text-red-400' : 'text-cyan-300'
          }`}>
            {safeRangeKm}
          </span>
          <span className="text-xs text-slate-400 font-mono-telemetry">KM</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          Formula: ((SOC - 2%) &times; Cap) &divide; Cons.
        </div>
      </div>

      {/* Stat 2: Usable Energy & Buffer */}
      <div className="p-3.5 rounded-xl border bg-slate-900/80 border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="uppercase tracking-wider font-semibold">Net Usable kWh</span>
          <BatteryCharging className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-1.5 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono-telemetry text-slate-100">
            {Math.max(0, (((soc - 2) / 100) * selectedVehicle.batteryCapacity)).toFixed(1)}
          </span>
          <span className="text-xs text-slate-400 font-mono-telemetry">
            / {selectedVehicle.batteryCapacity} kWh
          </span>
        </div>
        <div className="text-[10px] text-amber-400/90 mt-1 flex items-center space-x-1">
          <span>Protected: 2% BMS Reserve</span>
        </div>
      </div>

      {/* Stat 3: Reachable Infrastructure */}
      <div className="p-3.5 rounded-xl border bg-slate-900/80 border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="uppercase tracking-wider font-semibold">Reachable Hubs</span>
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-1.5 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono-telemetry text-emerald-400">
            {reachableCount}
          </span>
          <span className="text-xs text-slate-400 font-mono-telemetry">
            / {stations.length} compatible
          </span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1">
          {reachableCount > 0 ? 'Adequate corridor coverage' : 'Warning: zero reachable hubs'}
        </div>
      </div>

      {/* Stat 4: Closest Anchor Target */}
      <div className="p-3.5 rounded-xl border bg-slate-900/80 border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="uppercase tracking-wider font-semibold">Nearest Target</span>
          <MapPin className="w-4 h-4 text-cyan-400" />
        </div>
        {closestStation ? (
          <>
            <div className="mt-1.5 flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold font-mono-telemetry text-slate-100">
                {closestStation.distanceKm}
              </span>
              <span className="text-xs text-slate-400 font-mono-telemetry">KM</span>
              <span className="text-[11px] text-slate-400 truncate max-w-[80px]">
                ({closestStation.etaMinutes}m)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-1">
              {closestStation.name}
            </div>
          </>
        ) : (
          <div className="text-xs text-slate-500 mt-2">None active</div>
        )}
      </div>
    </div>
  );
}


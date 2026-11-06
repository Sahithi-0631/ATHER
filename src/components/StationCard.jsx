import React from 'react';
import { Zap, Wrench, ShieldAlert, CheckCircle2, XCircle, Clock, Navigation, Phone, Cpu, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function StationCard({
  station,
  safeRangeKm,
  isSelected,
  onSelect,
  onLock,
  onCall
}) {
  const isReachable = station.distanceKm <= safeRangeKm;
  const isMechanic = station.type === 'MECHANIC';
  const isFlatbed = station.category === '4W_FLATBED_RSA';

  // Left accent border color
  const getBorderColor = () => {
    if (isMechanic) return isFlatbed ? 'border-l-cyan-400' : 'border-l-amber-400';
    return isReachable ? 'border-l-emerald-400' : 'border-l-rose-500/80';
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl p-4 border border-l-4 transition-all duration-200 cursor-pointer relative overflow-hidden backdrop-blur-xl ${getBorderColor()} ${
        isSelected
          ? 'bg-slate-800/90 border-cyan-500/70 shadow-2xl ring-1 ring-cyan-500/40 glow-cyan'
          : isReachable
          ? 'bg-slate-900/60 hover:bg-slate-850/80 border-slate-700/50 hover:border-slate-600 shadow-lg'
          : 'bg-slate-950/70 opacity-80 hover:opacity-100 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div className="space-y-3">
        {/* Top Header: Title, Category & Status */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-white tracking-tight font-chakra truncate">
                {station.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {station.address}
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0 gap-1">
            <span className={`text-[10px] font-mono-telemetry font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              station.status === 'Available'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {station.status}
            </span>

            {/* Mini Confidence Indicator Badge */}
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-[10px] text-slate-300 font-mono-telemetry border border-slate-700/60 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{station.uptime_score} Uptime</span>
            </span>
          </div>
        </div>

        {/* Telemetry Chips (Power, Ports, Connectors) */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {/* Power output with icon */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] text-slate-200">
            {isMechanic ? (
              <Wrench className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span className="truncate max-w-[210px] font-mono-telemetry">{station.power}</span>
          </div>

          {/* Port count */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 font-mono-telemetry text-[11px] text-cyan-300">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{typeof station.ports === 'number' ? `${station.ports} Guns` : station.ports}</span>
          </div>

          {/* Connectors tag pills */}
          {station.connector_types?.map((conn) => (
            <span
              key={conn}
              className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-[10px] font-mono-telemetry text-emerald-300 font-medium"
            >
              {conn}
            </span>
          ))}

          {/* Last charge time */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 font-mono-telemetry text-[10px] text-slate-400 ml-auto">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{station.last_charge_time}</span>
          </div>
        </div>

        {/* Reachability, ETA, & Arrival SOC Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-[11px]">
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Navigation className="w-2.5 h-2.5 text-slate-400" />
              <span>Distance</span>
            </div>
            <div className="font-mono-telemetry font-bold text-white text-xs mt-0.5">
              {station.distanceKm} km
            </div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Clock className="w-2.5 h-2.5 text-slate-400" />
              <span>Drive ETA</span>
            </div>
            <div className="font-mono-telemetry font-medium text-slate-200 text-xs mt-0.5">
              ~{station.etaMinutes} mins
            </div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">Arrival SOC</div>
            <div className={`font-mono-telemetry font-bold text-xs mt-0.5 ${
              station.arrivalSoc > 15 ? 'text-emerald-400' : station.arrivalSoc > 0 ? 'text-amber-400' : 'text-red-400'
            }`}>
              ~{station.arrivalSoc}%
            </div>
          </div>
        </div>

        {/* Triage Note Callout for Mechanics */}
        {isMechanic && station.triage_note && (
          <div className="bg-blue-950/50 border border-blue-800/60 rounded-xl p-2.5 text-[11px] text-blue-200 leading-relaxed shadow-inner">
            <div className="flex items-center space-x-1.5 text-cyan-300 font-bold mb-0.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{isFlatbed ? 'Mandatory EV Flatbed Protocol' : '2W Mobile Rapid Triage'}</span>
            </div>
            <p className="text-[10px] text-blue-200/90">{station.triage_note}</p>
          </div>
        )}

        {/* Bottom Actions & Reachability Status */}
        <div className="flex items-center justify-between pt-1 gap-2">
          {/* Status badge */}
          <div className="flex items-center space-x-1 text-xs">
            {isReachable ? (
              <span className="text-emerald-400 font-semibold flex items-center space-x-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reachable (+{station.marginKm} km margin)</span>
              </span>
            ) : (
              <span className="text-rose-400 font-semibold flex items-center space-x-1.5 text-[11px]">
                <XCircle className="w-3.5 h-3.5" />
                <span>Exceeds Safe Range ({Math.abs(station.marginKm)} km short)</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            {!isMechanic ? (
              <button
                type="button"
                onClick={() => onLock(station)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs transition-all duration-150 flex items-center space-x-1.5 shadow-md shadow-emerald-700/40"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Lock Slot</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onCall(station)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs transition-all duration-150 flex items-center space-x-1.5 shadow-md shadow-red-700/40"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Dispatch RSA</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

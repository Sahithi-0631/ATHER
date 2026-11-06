import React from 'react';
import { Zap, Wrench, ShieldAlert, CheckCircle2, XCircle, Clock, Battery, Navigation, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

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

  return (
    <div
      onClick={onSelect}
      className={`rounded-xl p-3.5 border transition-all cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
          : isReachable
          ? 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
          : 'bg-slate-950/60 opacity-80 hover:opacity-100 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Reachability Indicator Accent Line */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1 ${
          isMechanic
            ? isFlatbed ? 'bg-blue-500' : 'bg-orange-500'
            : isReachable ? 'bg-emerald-500' : 'bg-rose-500/50'
        }`}
      />

      <div className="pl-1.5 space-y-2.5">
        {/* Top Header: Title, Category & Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="font-semibold text-sm text-slate-100 truncate">
                {station.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {station.address}
            </p>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className={`text-[10px] font-mono-telemetry font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
              station.status === 'Available'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {station.status}
            </span>
            <span className="text-[10px] font-mono-telemetry text-slate-400 mt-1">
              Uptime: {station.uptime_score}
            </span>
          </div>
        </div>

        {/* Telemetry Chips (Power, Ports, Connectors) */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
            {isMechanic ? (
              <Wrench className="w-3 h-3 text-blue-400" />
            ) : (
              <Zap className="w-3 h-3 text-amber-400" />
            )}
            <span className="truncate max-w-[200px]">{station.power}</span>
          </div>

          <div className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono-telemetry text-[11px] text-cyan-300">
            {typeof station.ports === 'number' ? `${station.ports} Ports` : station.ports}
          </div>

          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono-telemetry text-[10px] text-slate-400">
            <Clock className="w-2.5 h-2.5" />
            <span>{station.last_charge_time}</span>
          </div>
        </div>

        {/* Reachability & ETA metrics bar */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 text-[11px]">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Distance</div>
            <div className="font-mono-telemetry font-bold text-slate-200">
              {station.distanceKm} km
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Drive ETA</div>
            <div className="font-mono-telemetry font-medium text-slate-200">
              ~{station.etaMinutes} mins
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Arrival SOC</div>
            <div className={`font-mono-telemetry font-bold ${
              station.arrivalSoc > 15 ? 'text-emerald-400' : station.arrivalSoc > 0 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {station.arrivalSoc}%
            </div>
          </div>
        </div>

        {/* Triage Note Callout for Mechanics */}
        {isMechanic && station.triage_note && (
          <div className="bg-blue-950/40 border border-blue-800/50 rounded-lg p-2 text-[11px] text-blue-200 leading-relaxed">
            <div className="flex items-center space-x-1 text-blue-400 font-semibold mb-0.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{isFlatbed ? 'Mandatory Flatbed Protocol' : 'Mobile 2W Rapid Triage'}</span>
            </div>
            <p className="text-[10px] text-blue-200/90">{station.triage_note}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-1 gap-2">
          {/* Status badge */}
          <div className="flex items-center space-x-1 text-xs">
            {isReachable ? (
              <span className="text-emerald-400 font-semibold flex items-center space-x-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reachable</span>
              </span>
            ) : (
              <span className="text-rose-400 font-semibold flex items-center space-x-1 text-[11px]">
                <XCircle className="w-3.5 h-3.5" />
                <span>Exceeds Range ({Math.abs(station.marginKm)}km)</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
            {!isMechanic ? (
              <button
                onClick={() => onLock(station)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1 shadow-sm"
              >
                <Zap className="w-3 h-3" />
                <span>Lock Slot</span>
              </button>
            ) : (
              <button
                onClick={() => onCall(station)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1 shadow-sm"
              >
                <Phone className="w-3 h-3" />
                <span>Call RSA</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


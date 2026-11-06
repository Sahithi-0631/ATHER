import React, { useState } from 'react';
import StationCard from './StationCard';
import { Filter, Zap, Wrench, ShieldCheck, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

export default function StationList({
  stations,
  safeRangeKm,
  selectedStation,
  selectedVehicle,
  onSelectStation,
  onLockStation,
  onCallStation
}) {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'REACHABLE' | 'CHARGERS' | 'MECHANICS'

  // Filtering based on tab
  const filteredList = stations.filter(st => {
    const isReachable = st.distanceKm <= safeRangeKm;
    if (activeTab === 'REACHABLE') return isReachable;
    if (activeTab === 'CHARGERS') return st.type === 'CHARGER';
    if (activeTab === 'MECHANICS') return st.type === 'MECHANIC';
    return true; // 'ALL'
  });

  const reachableCount = stations.filter(st => st.distanceKm <= safeRangeKm).length;
  const chargersCount = stations.filter(st => st.type === 'CHARGER').length;
  const mechanicsCount = stations.filter(st => st.type === 'MECHANIC').length;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-slate-700/40 shadow-2xl flex flex-col h-[540px]">
      {/* Header with Protocol Gate confirmation */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-chakra flex items-center gap-1.5">
              <span>Corridor Triage Stream</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </h2>
            <span className="text-xs font-mono-telemetry text-cyan-300 font-bold bg-cyan-950/70 border border-cyan-800/80 px-2.5 py-0.5 rounded-full shadow-inner">
              {filteredList.length} Units Active
            </span>
          </div>

          <div className="text-[11px] font-mono-telemetry text-slate-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">{selectedVehicle.type} Hardware Filter</span>
          </div>
        </div>

        {/* Hardware Filter Explainer Bar */}
        <div className="mt-2.5 text-[11px] px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-400 flex items-center justify-between">
          <span>
            {selectedVehicle.type === '4W' ? (
              <>Filtered for <strong className="text-cyan-300">CCS2 / Type 2 & Flatbed Towing</strong> (2W sockets excluded)</>
            ) : (
              <>Filtered for <strong className="text-emerald-300">Ather Grid / 16A / Battery Swap & Mobile Tow</strong> (Car DC excluded)</>
            )}
          </span>
          <span className="text-[10px] text-slate-500 font-mono-telemetry uppercase">NH-44 Sector</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs mb-3.5 gap-1.5 overflow-x-auto shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 min-w-[70px] py-1.5 px-2.5 rounded-lg font-medium transition-all text-center whitespace-nowrap text-xs ${
            activeTab === 'ALL'
              ? 'bg-slate-800 text-white shadow-md border border-slate-700/80 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({stations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('REACHABLE')}
          className={`flex-1 min-w-[85px] py-1.5 px-2.5 rounded-lg font-medium transition-all text-center whitespace-nowrap flex items-center justify-center space-x-1.5 text-xs ${
            activeTab === 'REACHABLE'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-md font-bold glow-emerald'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reachable ({reachableCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('CHARGERS')}
          className={`flex-1 min-w-[80px] py-1.5 px-2.5 rounded-lg font-medium transition-all text-center whitespace-nowrap flex items-center justify-center space-x-1.5 text-xs ${
            activeTab === 'CHARGERS'
              ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 shadow-md font-bold glow-cyan'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Chargers ({chargersCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('MECHANICS')}
          className={`flex-1 min-w-[85px] py-1.5 px-2.5 rounded-lg font-medium transition-all text-center whitespace-nowrap flex items-center justify-center space-x-1.5 text-xs ${
            activeTab === 'MECHANICS'
              ? 'bg-red-600/30 text-red-300 border border-red-500/50 shadow-md font-bold glow-coral'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-cyan-400" />
          <span>Triage RSA ({mechanicsCount})</span>
        </button>
      </div>

      {/* Scrollable Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1.5" style={{ overscrollBehavior: 'contain' }}>
        {filteredList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <AlertTriangle className="w-8 h-8 text-amber-500/60 mb-2" />
            <p className="text-xs text-slate-400">
              No matching infrastructure points under this filter.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className="mt-2 text-xs text-cyan-400 hover:underline font-semibold"
            >
              Reset to All Compatible
            </button>
          </div>
        ) : (
          filteredList.map((st) => (
            <StationCard
              key={st.id}
              station={st}
              safeRangeKm={safeRangeKm}
              isSelected={selectedStation?.id === st.id}
              onSelect={() => onSelectStation(st)}
              onLock={onLockStation}
              onCall={onCallStation}
            />
          ))
        )}
      </div>
    </div>
  );
}

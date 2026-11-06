import React, { useState } from 'react';
import StationCard from './StationCard';
import { Filter, Zap, Wrench, ShieldCheck, CheckCircle2, AlertTriangle, Compass } from 'lucide-react';

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
    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col h-[520px]">
      {/* Header with Protocol Gate confirmation */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-chakra">
              Corridor Triage List
            </h2>
            <span className="text-xs font-mono-telemetry text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
              {filteredList.length} Active
            </span>
          </div>

          <div className="text-[11px] font-mono-telemetry text-slate-400 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Strict {selectedVehicle.type} Hardware Filter</span>
          </div>
        </div>

        {/* Hardware Filter Explainer Bar */}
        <div className="mt-2 text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-400 flex items-center justify-between">
          <span>
            {selectedVehicle.type === '4W' ? (
              <>Showing <strong className="text-blue-300">CCS2 / Type 2 & Flatbed RSA</strong> (2W sockets excluded)</>
            ) : (
              <>Showing <strong className="text-emerald-300">Ather Grid / 16A / Swap & Mobile RSA</strong> (Car DC excluded)</>
            )}
          </span>
          <span className="text-[10px] text-slate-400">NH-44 Sector</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs mb-3 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg font-medium transition-all text-center whitespace-nowrap ${
            activeTab === 'ALL'
              ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({stations.length})
        </button>
        <button
          onClick={() => setActiveTab('REACHABLE')}
          className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg font-medium transition-all text-center whitespace-nowrap flex items-center justify-center space-x-1 ${
            activeTab === 'REACHABLE'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Reachable ({reachableCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('CHARGERS')}
          className={`flex-1 min-w-[75px] py-1.5 px-2 rounded-lg font-medium transition-all text-center whitespace-nowrap flex items-center justify-center space-x-1 ${
            activeTab === 'CHARGERS'
              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Chargers ({chargersCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('MECHANICS')}
          className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg font-medium transition-all text-center whitespace-nowrap flex items-center justify-center space-x-1 ${
            activeTab === 'MECHANICS'
              ? 'bg-red-600/30 text-red-300 border border-red-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3 h-3 text-blue-400" />
          <span>Triage RSA ({mechanicsCount})</span>
        </button>
      </div>

      {/* Scrollable Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {filteredList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <AlertTriangle className="w-8 h-8 text-amber-500/60 mb-2" />
            <p className="text-xs text-slate-400">
              No matching points under this filter.
            </p>
            <button
              onClick={() => setActiveTab('ALL')}
              className="mt-2 text-xs text-emerald-400 hover:underline"
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


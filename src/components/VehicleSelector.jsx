import React, { useState } from 'react';
import { VEHICLES } from '../data/vehicles';
import { Car, Bike, BatteryCharging, Gauge, Check, ChevronDown, Zap } from 'lucide-react';

export default function VehicleSelector({ selectedVehicle, onSelectVehicle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | '4W' | '2W'

  const filteredVehicles = filterType === 'ALL' 
    ? VEHICLES 
    : VEHICLES.filter(v => v.type === filterType);

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl backdrop-blur-md relative">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <span>Vehicle Profile</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono-telemetry">
            Hardware Gate
          </span>
        </label>

        {/* 4W / 2W filter toggles */}
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              filterType === 'ALL' 
                ? 'bg-slate-800 text-white font-medium shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('4W')}
            className={`px-2 py-0.5 rounded-md flex items-center space-x-1 transition-all ${
              filterType === '4W' 
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 font-medium' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-3 h-3" />
            <span>4W</span>
          </button>
          <button
            onClick={() => setFilterType('2W')}
            className={`px-2 py-0.5 rounded-md flex items-center space-x-1 transition-all ${
              filterType === '2W' 
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 font-medium' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bike className="w-3 h-3" />
            <span>2W</span>
          </button>
        </div>
      </div>

      {/* Main Selected Card / Trigger Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-slate-950/90 hover:bg-slate-950 border border-slate-700/80 hover:border-slate-600 rounded-xl p-3 text-left transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`p-2 rounded-xl text-xl flex items-center justify-center border ${
              selectedVehicle.type === '4W' 
                ? 'bg-blue-950/60 border-blue-800/80 text-blue-400' 
                : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
            }`}>
              {selectedVehicle.image}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-100 text-sm truncate">
                  {selectedVehicle.name}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  selectedVehicle.type === '4W'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {selectedVehicle.type}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span>{selectedVehicle.batteryCapacity} kWh pack</span>
                <span>•</span>
                <span>{selectedVehicle.consumption} kWh/km</span>
              </div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 group-hover:text-slate-200 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 space-y-1 max-h-72 overflow-y-auto">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Fleet Vehicle
              </div>
              {filteredVehicles.map((vehicle) => {
                const isSelected = vehicle.id === selectedVehicle.id;
                return (
                  <button
                    key={vehicle.id}
                    onClick={() => {
                      onSelectVehicle(vehicle);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 text-white border border-emerald-500/50'
                        : 'hover:bg-slate-800/60 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="text-xl">{vehicle.image}</span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-slate-100 truncate">
                            {vehicle.name}
                          </span>
                          <span className={`text-[9px] px-1 py-0.2 rounded font-mono-telemetry font-bold ${
                            vehicle.type === '4W' 
                              ? 'bg-blue-900/60 text-blue-300' 
                              : 'bg-emerald-900/60 text-emerald-300'
                          }`}>
                            {vehicle.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                          <span>{vehicle.batteryCapacity} kWh</span>
                          <span>•</span>
                          <span>{vehicle.consumption} kWh/km</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-mono-telemetry">{vehicle.connectors.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Hardware Compatibility Badges */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[11px]">Active Connectors:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {selectedVehicle.connectors.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono-telemetry text-[10px] text-emerald-300 font-medium"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


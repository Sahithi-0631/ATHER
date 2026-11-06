import React, { useState, useRef, useEffect } from 'react';
import { VEHICLES } from '../data/vehicles';
import { Car, Bike, Check, ChevronDown, Zap } from 'lucide-react';

export default function VehicleSelector({ selectedVehicle, onSelectVehicle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | '4W' | '2W'
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Close dropdown on outside click without a full-screen blocking overlay
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Separate vehicles into 2W and 4W groups for distinct visual hierarchy
  const twoWheelers = VEHICLES.filter(v => v.type === '2W');
  const fourWheelers = VEHICLES.filter(v => v.type === '4W');

  const show2W = filterType === 'ALL' || filterType === '2W';
  const show4W = filterType === 'ALL' || filterType === '4W';

  return (
    <div 
      ref={dropdownRef}
      className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl backdrop-blur-md relative z-30"
    >
      {/* Header and Filter Switcher */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <span>Vehicle Profile</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-telemetry border border-slate-700">
            Hardware Gate
          </span>
        </label>

        {/* 4W / 2W filter toggles */}
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setFilterType('ALL')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              filterType === 'ALL' 
                ? 'bg-slate-800 text-white font-medium shadow-sm border border-slate-700' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
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
          <button
            type="button"
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
        </div>
      </div>

      {/* Main Trigger Button */}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="w-full bg-slate-950/90 hover:bg-slate-950 border border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 rounded-xl p-3 text-left transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`p-2 rounded-xl text-xl flex items-center justify-center border shrink-0 ${
              selectedVehicle.type === '4W' 
                ? 'bg-blue-950/60 border-blue-800/80 text-blue-400' 
                : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
            }`}>
              {selectedVehicle.image}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white text-sm truncate">
                  {selectedVehicle.name}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
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
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 group-hover:text-slate-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`} />
        </button>

        {/* Custom Dropdown Menu with High Contrast & Smooth Scrolling */}
        {isOpen && (
          <div 
            role="listbox"
            tabIndex={-1}
            style={{ 
              overscrollBehavior: 'contain',
              WebkitOverflowScrolling: 'touch'
            }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto overscroll-contain focus:outline-none divide-y divide-slate-800/90"
          >
            {/* 2-Wheelers Group */}
            {show2W && (
              <div className="pb-1.5">
                <div className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Bike className="w-3 h-3" />
                    <span>2-Wheelers (Ather & Urban Commuters)</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-normal">Type 6 / 16A</span>
                </div>
                <div className="space-y-1 mt-1">
                  {twoWheelers.map((vehicle) => {
                    const isSelected = vehicle.id === selectedVehicle.id;
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onSelectVehicle(vehicle);
                          setIsOpen(false);
                          triggerRef.current?.focus();
                        }}
                        className={`w-full p-2.5 rounded-lg text-left transition-colors flex items-center justify-between group focus:outline-none focus:ring-1 focus:ring-emerald-400 ${
                          isSelected
                            ? 'bg-slate-800 border border-emerald-500/60 shadow-sm text-white'
                            : 'hover:bg-slate-800/80 border border-transparent text-slate-200 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="text-xl shrink-0">{vehicle.image}</span>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-white truncate">
                                {vehicle.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono-telemetry font-bold bg-emerald-950 border border-emerald-800 text-emerald-300 shrink-0">
                                2W
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                              <span>{vehicle.batteryCapacity} kWh</span>
                              <span>•</span>
                              <span>{vehicle.consumption} kWh/km</span>
                              <span>•</span>
                              <span className="text-emerald-300 font-mono-telemetry truncate">
                                {vehicle.connectors.join(', ')}
                              </span>
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
              </div>
            )}

            {/* 4-Wheelers Group */}
            {show4W && (
              <div className={show2W ? 'pt-2' : ''}>
                <div className="px-2.5 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Car className="w-3 h-3" />
                    <span>4-Wheelers (CCS2 / Type 2)</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-normal">DC Fast / Flatbed</span>
                </div>
                <div className="space-y-1 mt-1">
                  {fourWheelers.map((vehicle) => {
                    const isSelected = vehicle.id === selectedVehicle.id;
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onSelectVehicle(vehicle);
                          setIsOpen(false);
                          triggerRef.current?.focus();
                        }}
                        className={`w-full p-2.5 rounded-lg text-left transition-colors flex items-center justify-between group focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                          isSelected
                            ? 'bg-slate-800 border border-blue-500/60 shadow-sm text-white'
                            : 'hover:bg-slate-800/80 border border-transparent text-slate-200 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="text-xl shrink-0">{vehicle.image}</span>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-white truncate">
                                {vehicle.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono-telemetry font-bold bg-blue-950 border border-blue-800 text-blue-300 shrink-0">
                                4W
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                              <span>{vehicle.batteryCapacity} kWh</span>
                              <span>•</span>
                              <span>{vehicle.consumption} kWh/km</span>
                              <span>•</span>
                              <span className="text-cyan-300 font-mono-telemetry truncate">
                                {vehicle.connectors.join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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

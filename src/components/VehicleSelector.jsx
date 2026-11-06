import React, { useState, useRef, useEffect } from 'react';
import { VEHICLES } from '../data/vehicles';
import { Car, Bike, Check, ChevronDown, Zap, Sparkles, Gauge } from 'lucide-react';

export default function VehicleSelector({ selectedVehicle, onSelectVehicle }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Close dropdown on click outside or escape key
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

  // Two categories
  const twoWheelers = VEHICLES.filter(v => v.type === '2W');
  const fourWheelers = VEHICLES.filter(v => v.type === '4W');

  // Switcher for 2-segment quick switch
  const handleSegmentSwitch = (type) => {
    if (selectedVehicle.type !== type) {
      const defaultForType = VEHICLES.find(v => v.type === type);
      if (defaultForType) {
        onSelectVehicle(defaultForType);
      }
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-slate-700/40 shadow-2xl relative z-30"
    >
      {/* Top Header & Segment Switcher */}
      <div className="flex items-center justify-between mb-3.5 gap-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <span>Vehicle Cockpit Profile</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono-telemetry border border-slate-700/80">
            Hardware Gate Active
          </span>
        </label>

        {/* 2-Segment Switcher ([2W Scooters] vs [4W Cars]) */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs shadow-inner">
          <button
            type="button"
            onClick={() => handleSegmentSwitch('2W')}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 transition-all duration-200 font-medium ${
              selectedVehicle.type === '2W'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm glow-emerald'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>2W Scooters</span>
          </button>
          <button
            type="button"
            onClick={() => handleSegmentSwitch('4W')}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1.5 transition-all duration-200 font-medium ${
              selectedVehicle.type === '4W'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>4W Cars</span>
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
          className="w-full bg-slate-950/90 hover:bg-slate-950 border border-slate-700/70 hover:border-cyan-500/60 focus:border-cyan-400 rounded-xl p-3.5 text-left transition-all duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-cyan-500/30 shadow-lg"
        >
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className={`p-2.5 rounded-2xl text-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${
              selectedVehicle.type === '4W' 
                ? 'bg-cyan-950/60 border-cyan-700/70 text-cyan-400 glow-cyan' 
                : 'bg-emerald-950/60 border-emerald-700/70 text-emerald-400 glow-emerald'
            }`}>
              {selectedVehicle.image}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm sm:text-base tracking-tight truncate">
                  {selectedVehicle.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                  selectedVehicle.type === '4W'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {selectedVehicle.type}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                <span className="font-mono-telemetry text-slate-300">{selectedVehicle.batteryCapacity} kWh pack</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono-telemetry text-slate-300">{selectedVehicle.consumption} kWh/km</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-mono-telemetry truncate">{selectedVehicle.nominalRange} km nominal</span>
              </div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 group-hover:text-cyan-300 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
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
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 max-h-60 overflow-y-auto overscroll-contain focus:outline-none divide-y divide-slate-800/90 backdrop-blur-2xl"
          >
            {/* 2-Wheelers Group */}
            <div className="pb-2">
              <div className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Bike className="w-3.5 h-3.5" />
                  <span>2-Wheelers (Ather & Urban EV Commuters)</span>
                </span>
                <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-normal">
                  Type 6 / 16A Sockets
                </span>
              </div>
              <div className="space-y-1 mt-1.5">
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
                      className={`w-full p-2.5 rounded-xl text-left transition-all duration-150 flex items-center justify-between group focus:outline-none focus:ring-1 focus:ring-emerald-400 ${
                        isSelected
                          ? 'bg-slate-800 border border-emerald-500/60 shadow-md text-white'
                          : 'hover:bg-slate-800/70 border border-transparent text-slate-200 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="text-xl shrink-0">{vehicle.image}</span>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white truncate">
                              {vehicle.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono-telemetry font-bold bg-emerald-950 border border-emerald-800 text-emerald-300 shrink-0">
                              2W
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span className="font-mono-telemetry text-slate-300">{vehicle.batteryCapacity} kWh</span>
                            <span>•</span>
                            <span className="font-mono-telemetry text-slate-300">{vehicle.consumption} kWh/km</span>
                            <span>•</span>
                            <span className="text-emerald-300 font-mono-telemetry truncate">
                              {vehicle.connectors.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4-Wheelers Group */}
            <div className="pt-2">
              <div className="px-2.5 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Car className="w-3.5 h-3.5" />
                  <span>4-Wheelers (CCS2 High-Voltage Passenger EVs)</span>
                </span>
                <span className="text-[9px] px-2 py-0.2 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-normal">
                  DC Fast / Flatbed Safe
                </span>
              </div>
              <div className="space-y-1 mt-1.5">
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
                      className={`w-full p-2.5 rounded-xl text-left transition-all duration-150 flex items-center justify-between group focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                        isSelected
                          ? 'bg-slate-800 border border-cyan-500/60 shadow-md text-white'
                          : 'hover:bg-slate-800/70 border border-transparent text-slate-200 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="text-xl shrink-0">{vehicle.image}</span>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white truncate">
                              {vehicle.name}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono-telemetry font-bold bg-cyan-950 border border-cyan-800 text-cyan-300 shrink-0">
                              4W
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span className="font-mono-telemetry text-slate-300">{vehicle.batteryCapacity} kWh</span>
                            <span>•</span>
                            <span className="font-mono-telemetry text-slate-300">{vehicle.consumption} kWh/km</span>
                            <span>•</span>
                            <span className="text-cyan-300 font-mono-telemetry truncate">
                              {vehicle.connectors.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hardware Compatibility Badges */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[11px]">Active Physical Sockets:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selectedVehicle.connectors.map((c) => (
            <span
              key={c}
              className="px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700/80 font-mono-telemetry text-[10px] text-cyan-300 font-medium shadow-sm"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { USER_LOCATION } from '../data/vehicles';
import { Zap, Wrench, ShieldAlert, Navigation, Phone, CheckCircle2, XCircle, ArrowUpRight, Layers, Eye } from 'lucide-react';

// Smooth Map Controller to pan and zoom
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom DivIcon for User Vehicle Location with Cockpit Beacon Glow
function createUserIcon(selectedVehicle, isCritical) {
  const color = isCritical ? '#ff3366' : '#00f0ff';
  const pulseColor = isCritical ? 'rgba(255, 51, 102, 0.45)' : 'rgba(0, 240, 255, 0.4)';
  
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 48px; height: 48px; border-radius: 9999px; background: ${pulseColor}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: #070b14; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ${color}, inset 0 0 10px ${color}40; z-index: 2;">
          <span style="font-size: 18px;">${selectedVehicle.image}</span>
        </div>
        <div style="position: absolute; bottom: -8px; background: ${color}; color: #000; font-weight: 900; font-size: 8px; font-family: monospace; padding: 1px 5px; border-radius: 9999px; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(0,0,0,0.8); z-index: 3;">
          YOU
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24]
  });
}

// Custom DivIcon for Charging Hubs & Mechanics with Vibrant Glow
function createStationIcon(station, isReachable) {
  const isMechanic = station.type === 'MECHANIC';
  
  let primaryColor = isReachable ? '#10b981' : '#64748b';
  let glowColor = isReachable ? 'rgba(16, 185, 129, 0.5)' : 'rgba(100, 116, 139, 0.2)';
  let bgGradient = isReachable 
    ? 'linear-gradient(135deg, #059669, #10b981)' 
    : 'linear-gradient(135deg, #334155, #1e293b)';
  let iconSvg = '';

  if (isMechanic) {
    const isFlatbed = station.category === '4W_FLATBED_RSA';
    primaryColor = isFlatbed ? '#38bdf8' : '#f59e0b';
    glowColor = isFlatbed ? 'rgba(56, 189, 248, 0.5)' : 'rgba(245, 158, 11, 0.5)';
    bgGradient = isFlatbed
      ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
      : 'linear-gradient(135deg, #d97706, #f59e0b)';
    iconSvg = `
      <svg style="width: 14px; height: 14px; fill: white;" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    `;
  } else {
    iconSvg = `
      <svg style="width: 14px; height: 14px; fill: white;" viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    `;
  }

  const pulseRing = isReachable
    ? `<div style="position: absolute; inset: -4px; border-radius: 12px; border: 2px solid ${primaryColor}; opacity: 0.6; animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; transform: rotate(45deg);"></div>`
    : '';

  return L.divIcon({
    className: 'custom-station-marker',
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ${pulseRing}
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 10px; background: ${bgGradient}; border: 2px solid ${primaryColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px ${glowColor}; transform: rotate(45deg); z-index: 2;">
          <div style="transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">
            ${iconSvg}
          </div>
        </div>
        <div style="position: absolute; bottom: -8px; background: #070b14; border: 1px solid ${primaryColor}; color: ${primaryColor}; font-weight: 800; font-size: 8px; font-family: monospace; padding: 1px 5px; border-radius: 9999px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.8); z-index: 3;">
          ${station.distanceKm}km
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  });
}

export default function MapView({
  selectedVehicle,
  soc,
  safeRangeKm,
  isCritical,
  stations,
  selectedStation,
  onSelectStation,
  onLockStation,
  onCallStation
}) {
  const mapCenter = [USER_LOCATION.lat, USER_LOCATION.lng];
  const radiusMeters = Math.max(100, safeRangeKm * 1000);

  // Basemap switcher: CartoDB Dark Matter (default as requested) vs Ultra-Clean OSM Night Vision
  const [usePureOsm, setUsePureOsm] = useState(false);

  // Circle styling based on critical emergency state
  const circleOptions = {
    color: isCritical ? '#ff3366' : '#00f0ff',
    fillColor: isCritical ? '#ff3366' : '#10b981',
    fillOpacity: isCritical ? 0.22 : 0.12,
    weight: isCritical ? 3 : 2,
    dashArray: isCritical ? '6, 6' : undefined,
    className: isCritical ? 'radar-circle-critical' : 'radar-circle'
  };

  const focusTarget = selectedStation 
    ? [selectedStation.lat, selectedStation.lng] 
    : mapCenter;

  return (
    <div className="relative w-full h-full min-h-[450px] lg:min-h-full rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl bg-[#070b14]">
      {/* Map HUD Header Overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-xl px-3 py-2 shadow-xl flex items-center space-x-2.5 pointer-events-auto">
        <span className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : 'bg-cyan-400'}`} />
        <span className="text-xs font-mono-telemetry font-bold text-white tracking-wider">
          LIVE TELEMETRY RADAR
        </span>
      </div>

      {/* Map HUD Legend Overlay */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-3 shadow-2xl text-xs space-y-2 max-w-[220px] hidden sm:block pointer-events-auto">
        <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider flex items-center justify-between">
          <span className="font-chakra">Cockpit HUD</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-cyan-300 font-mono-telemetry">
            NH-44
          </span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full border ${isCritical ? 'bg-red-500/30 border-red-500 glow-coral' : 'bg-cyan-500/30 border-cyan-400 glow-cyan'}`} />
            <span className="text-slate-300">
              Safe Isochrone ({safeRangeKm} km)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-emerald-500 rotate-45 border border-emerald-300 glow-emerald" />
            <span className="text-slate-300">Reachable Charger</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-slate-600 rotate-45 border border-slate-500" />
            <span className="text-slate-400">Out of Range</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-500 rotate-45 border border-blue-400 glow-cyan" />
            <span className="text-slate-300">Certified Triage RSA</span>
          </div>
        </div>
      </div>

      {/* Recenter & Basemap Switcher Buttons */}
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col space-y-2 pointer-events-auto">
        {/* Toggle between CartoDB Dark Matter and Clean OSM Night Vision */}
        <button
          type="button"
          onClick={() => setUsePureOsm(!usePureOsm)}
          title="Toggle Basemap Provider"
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-xl backdrop-blur-md flex items-center space-x-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95"
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-mono-telemetry text-[11px]">
            {usePureOsm ? 'OSM Night' : 'CartoDB Dark'}
          </span>
        </button>

        {/* Recenter to User */}
        <button
          type="button"
          onClick={() => onSelectStation(null)}
          title="Recenter Map on Current Position"
          className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-xl backdrop-blur-md flex items-center space-x-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95 glow-cyan"
        >
          <Navigation className="w-4 h-4 text-cyan-400" />
          <span className="font-mono-telemetry text-[11px]">My Position</span>
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={focusTarget} zoom={selectedStation ? 13 : 11} />

        {/* 100% Free CartoDB Dark Matter or Filtered OSM TileLayer */}
        {usePureOsm ? (
          <TileLayer
            className="osm-cockpit-tiles"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            subdomains="abcd"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        )}

        {/* Dynamic Safe Reachability Isochrone Circle */}
        <Circle
          center={mapCenter}
          radius={radiusMeters}
          pathOptions={circleOptions}
        />

        {/* User Vehicle Marker with Glowing Radar Aura */}
        <Marker
          position={mapCenter}
          icon={createUserIcon(selectedVehicle, isCritical)}
        >
          <Popup className="custom-popup">
            <div className="p-1 space-y-2 min-w-[210px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-xs text-white flex items-center space-x-1.5">
                  <span className="text-base">{selectedVehicle.image}</span>
                  <span>{selectedVehicle.name}</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isCritical ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {soc}% SOC
                </span>
              </div>
              <div className="text-[11px] space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Position Lock:</span>
                  <span className="font-mono text-slate-200">Kurnool NH-44</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Safe Usable Range:</span>
                  <span className="font-bold font-mono text-cyan-300">{safeRangeKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Architecture:</span>
                  <span className="text-slate-200">{selectedVehicle.type} ({selectedVehicle.batteryCapacity} kWh)</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Charging Infrastructure & Triage Mechanics */}
        {stations.map((st) => {
          const isReachable = st.distanceKm <= safeRangeKm;
          const isMechanic = st.type === 'MECHANIC';

          return (
            <Marker
              key={st.id}
              position={[st.lat, st.lng]}
              icon={createStationIcon(st, isReachable)}
              eventHandlers={{
                click: () => onSelectStation(st)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1.5 space-y-2.5 min-w-[250px]">
                  {/* Title & Status */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-white leading-tight font-chakra">
                        {st.name}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono-telemetry uppercase tracking-wider ${
                        st.status === 'Available'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {st.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2">
                      <span className="font-mono text-cyan-300">{st.power}</span>
                    </div>
                  </div>

                  {/* Reachability & ETA metrics */}
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Distance & ETA:</span>
                      <span className="font-bold font-mono text-white">
                        {st.distanceKm} km (~{st.etaMinutes} mins)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Reachability:</span>
                      {isReachable ? (
                        <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In Range (+{st.marginKm} km)</span>
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold flex items-center space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Short by {Math.abs(st.marginKm)} km</span>
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Arrival SOC:</span>
                      <span className="font-mono text-cyan-300 font-semibold">
                        ~{st.arrivalSoc}%
                      </span>
                    </div>
                  </div>

                  {/* Special Triage Note for Mechanics */}
                  {isMechanic && st.triage_note && (
                    <div className="bg-blue-950/50 border border-blue-800/60 p-2 rounded-xl text-[10px] text-blue-200 leading-tight">
                      <strong>Cockpit Triage:</strong> {st.triage_note}
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2 pt-1 border-t border-slate-800">
                    {!isMechanic ? (
                      <button
                        type="button"
                        onClick={() => onLockStation(st)}
                        className="flex-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-700/30"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Lock Slot</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCallStation(st)}
                        className="flex-1 py-2 px-2.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-lg shadow-red-700/40"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Dispatch RSA</span>
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center justify-center space-x-1 border border-slate-700"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>GPS</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

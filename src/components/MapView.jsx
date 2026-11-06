import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { USER_LOCATION } from '../data/vehicles';
import { Zap, Wrench, ShieldAlert, Navigation, Phone, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';

// Helper component to smoothly center/zoom the map
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

// Custom DivIcon Generator for User Vehicle Location
function createUserIcon(selectedVehicle, isCritical) {
  const color = isCritical ? '#ef4444' : '#10b981';
  const pulseClass = isCritical ? 'animate-ping' : '';
  
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 40px; height: 40px; border-radius: 9999px; background: ${color}; opacity: 0.25;" class="${pulseClass}"></div>
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background: #0f172a; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          <span style="font-size: 16px;">${selectedVehicle.image}</span>
        </div>
        <div style="position: absolute; bottom: -8px; background: ${color}; color: #000; font-weight: 800; font-size: 8px; font-family: monospace; padding: 1px 4px; border-radius: 4px; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.4);">
          YOU
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
}

// Custom DivIcon Generator for Chargers & Mechanics
function createStationIcon(station, isReachable) {
  const isMechanic = station.type === 'MECHANIC';
  
  let bgGradient = isReachable 
    ? 'linear-gradient(135deg, #059669, #10b981)' 
    : 'linear-gradient(135deg, #475569, #334155)';
  let borderColor = isReachable ? '#34d399' : '#64748b';
  let badgeColor = isReachable ? '#10b981' : '#94a3b8';
  let iconSvg = '';

  if (isMechanic) {
    bgGradient = station.category === '4W_FLATBED_RSA'
      ? 'linear-gradient(135deg, #1e3a8a, #2563eb)'
      : 'linear-gradient(135deg, #ea580c, #f97316)';
    borderColor = station.category === '4W_FLATBED_RSA' ? '#60a5fa' : '#fb923c';
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

  const reachabilityRing = isReachable 
    ? `<div style="position: absolute; inset: -3px; border-radius: 9999px; border: 2px solid ${borderColor}; opacity: 0.6; animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
    : '';

  return L.divIcon({
    className: 'custom-station-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ${reachabilityRing}
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 10px; background: ${bgGradient}; border: 2px solid ${borderColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.6); transform: rotate(45deg);">
          <div style="transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">
            ${iconSvg}
          </div>
        </div>
        <div style="position: absolute; bottom: -8px; background: #0f172a; border: 1px solid ${borderColor}; color: ${badgeColor}; font-weight: 700; font-size: 8px; font-family: monospace; padding: 0px 3px; border-radius: 4px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.5);">
          ${station.distanceKm}km
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
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

  // Circle styling based on critical emergency state
  const circleOptions = {
    color: isCritical ? '#ef4444' : '#10b981',
    fillColor: isCritical ? '#ef4444' : '#059669',
    fillOpacity: isCritical ? 0.22 : 0.12,
    weight: isCritical ? 3 : 2,
    dashArray: isCritical ? '6, 6' : undefined,
    className: isCritical ? 'radar-circle-critical' : 'radar-circle'
  };

  const focusTarget = selectedStation 
    ? [selectedStation.lat, selectedStation.lng] 
    : mapCenter;

  return (
    <div className="relative w-full h-full min-h-[450px] lg:min-h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs space-y-2 max-w-[210px] hidden sm:block pointer-events-auto">
        <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider flex items-center justify-between">
          <span>Map HUD Legend</span>
          <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full border ${isCritical ? 'bg-red-500/30 border-red-500' : 'bg-emerald-500/30 border-emerald-400'}`} />
            <span className="text-slate-300">
              Safe Isochrone ({safeRangeKm} km)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-emerald-500 rotate-45 border border-emerald-300" />
            <span className="text-slate-300">Reachable Charger</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-slate-600 rotate-45 border border-slate-400" />
            <span className="text-slate-400">Out of Safe Range</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-600 rotate-45 border border-blue-400" />
            <span className="text-slate-300">Certified Triage RSA</span>
          </div>
        </div>
      </div>

      {/* Recenter Quick Button */}
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col space-y-2 pointer-events-auto">
        <button
          onClick={() => onSelectStation(null)}
          title="Recenter Map on Current Position"
          className="p-2.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-xl backdrop-blur-md flex items-center space-x-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95"
        >
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>My Position</span>
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={focusTarget} zoom={selectedStation ? 13 : 11} />

        {/* High contrast dark tiles from CartoDB (No API key needed) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Dynamic Safe Reachability Isochrone Circle */}
        <Circle
          center={mapCenter}
          radius={radiusMeters}
          pathOptions={circleOptions}
        />

        {/* User Vehicle Marker */}
        <Marker
          position={mapCenter}
          icon={createUserIcon(selectedVehicle, isCritical)}
        >
          <Popup className="custom-popup">
            <div className="p-1 space-y-2 min-w-[200px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-xs text-slate-100 flex items-center space-x-1">
                  <span>{selectedVehicle.image}</span>
                  <span>{selectedVehicle.name}</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isCritical ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {soc}% SOC
                </span>
              </div>
              <div className="text-[11px] space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Position:</span>
                  <span className="font-mono text-slate-200">Kurnool NH-44</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Safe Usable Range:</span>
                  <span className="font-bold text-cyan-300">{safeRangeKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Architecture:</span>
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
                <div className="p-1 space-y-2.5 min-w-[240px]">
                  {/* Title & Status */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-white leading-tight">
                        {st.name}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono-telemetry uppercase tracking-wider ${
                        st.status === 'Available'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {st.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2">
                      <span>{st.power}</span>
                    </div>
                  </div>

                  {/* Reachability & ETA metrics */}
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Distance & ETA:</span>
                      <span className="font-bold font-mono text-slate-200">
                        {st.distanceKm} km ({st.etaMinutes} mins)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Reachability:</span>
                      {isReachable ? (
                        <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Reachable (+{st.marginKm} km)</span>
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold flex items-center space-x-1">
                          <XCircle className="w-3 h-3" />
                          <span>Out of Range ({Math.abs(st.marginKm)} km short)</span>
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Arrival SOC:</span>
                      <span className="font-mono text-cyan-300 font-medium">
                        ~{st.arrivalSoc}%
                      </span>
                    </div>
                  </div>

                  {/* Special Triage Note for Mechanics */}
                  {isMechanic && st.triage_note && (
                    <div className="bg-blue-950/40 border border-blue-800/60 p-2 rounded-lg text-[10px] text-blue-200 leading-tight">
                      <strong>Triage Note:</strong> {st.triage_note}
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2 pt-1 border-t border-slate-800">
                    {!isMechanic ? (
                      <button
                        onClick={() => onLockStation(st)}
                        className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-md shadow-emerald-700/30"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Lock Slot</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onCallStation(st)}
                        className="flex-1 py-1.5 px-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-md shadow-red-700/30"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Dispatch RSA</span>
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center justify-center space-x-1 border border-slate-700"
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


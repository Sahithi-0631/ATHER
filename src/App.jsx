import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import VehicleSelector from './components/VehicleSelector';
import RangeSlider from './components/RangeSlider';
import EmergencyBanner from './components/EmergencyBanner';
import TelemetryStats from './components/TelemetryStats';
import MapView from './components/MapView';
import StationList from './components/StationList';
import LockChargerModal from './components/LockChargerModal';
import RsaDispatchModal from './components/RsaDispatchModal';
import { VEHICLES, USER_LOCATION } from './data/vehicles';
import rawInfrastructure from './data/ev_infrastructure.json';
import { calculateDistanceKm, calculateSafeRange, calculateEstimatedSocAtArrival, calculateEtaMinutes } from './utils/geo';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

export default function App() {
  // 1. Vehicle Selector State (default: Tata Nexon EV)
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);

  // 2. State of Charge (SOC) slider (3% to 100%, default 35%)
  const [soc, setSoc] = useState(35);

  // Selected station for map inspection
  const [selectedStation, setSelectedStation] = useState(null);

  // Modal dialog states
  const [lockingStation, setLockingStation] = useState(null);
  const [dispatchingMechanic, setDispatchingMechanic] = useState(null);

  // Math: Safe_Range_Km = ((SOC - 2) / 100 * Battery_Capacity) / Consumption
  const safeRangeKm = useMemo(() => {
    return calculateSafeRange(soc, selectedVehicle.batteryCapacity, selectedVehicle.consumption);
  }, [soc, selectedVehicle]);

  // Critical Emergency Mode: SOC <= 15%
  const isCritical = soc <= 15;

  // 3. Strict Hardware Compatibility & Triage Filter
  const enrichedInfrastructure = useMemo(() => {
    // Filter by vehicle hardware compatibility
    const filtered = rawInfrastructure.filter((item) => {
      if (item.type === 'CHARGER') {
        if (selectedVehicle.type === '4W') {
          // 4W: Show CCS2 Fast DC and Type 2 chargers. Hide 2W-only sockets.
          const has4W = item.vehicle_class.includes('4W');
          const has4WConnectors = item.connector_types.some((c) => c === 'CCS2' || c === 'Type 2');
          return has4W && has4WConnectors;
        } else {
          // 2W: Show Ather Grid, 16A roadside dhaba sockets, and battery swap points. Hide CCS2-only DC car guns.
          const has2W = item.vehicle_class.includes('2W');
          const has2WConnectors = item.connector_types.some((c) =>
            ['Type 6', '16A 3-Pin', 'Battery Swap', 'Hypercharger'].includes(c)
          );
          // If it's purely CCS2-only, hide it
          const isPure4WCcs2 = item.connector_types.length === 1 && item.connector_types[0] === 'CCS2';
          return has2W && has2WConnectors && !isPure4WCcs2;
        }
      } else if (item.type === 'MECHANIC') {
        if (selectedVehicle.type === '4W') {
          // For 4W: Show only "Certified EV Flatbed RSA"
          return item.category === '4W_FLATBED_RSA';
        } else {
          // For 2W: Show "2W Mobile EV Repair & Pickup Towing"
          return item.category === '2W_MOBILE_RSA';
        }
      }
      return false;
    });

    // Calculate real-time distances, reachability, and ETAs from user coordinates
    return filtered
      .map((item) => {
        const distanceKm = calculateDistanceKm(
          USER_LOCATION.lat,
          USER_LOCATION.lng,
          item.lat,
          item.lng
        );
        const marginKm = Number((safeRangeKm - distanceKm).toFixed(1));
        const etaMinutes = calculateEtaMinutes(distanceKm);
        const arrivalSoc = calculateEstimatedSocAtArrival(
          soc,
          distanceKm,
          selectedVehicle.batteryCapacity,
          selectedVehicle.consumption
        );

        return {
          ...item,
          distanceKm,
          marginKm,
          etaMinutes,
          arrivalSoc
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [selectedVehicle, soc, safeRangeKm]);

  // Find nearest compatible fast charger & nearest mechanic for emergency quick-actions
  const nearestFastCharger = useMemo(() => {
    return enrichedInfrastructure.find((st) => st.type === 'CHARGER');
  }, [enrichedInfrastructure]);

  const nearestRsa = useMemo(() => {
    return enrichedInfrastructure.find((st) => st.type === 'MECHANIC');
  }, [enrichedInfrastructure]);

  // Handlers
  const handleLockNearestCharger = () => {
    if (nearestFastCharger) {
      setLockingStation(nearestFastCharger);
    }
  };

  const handleCallRsa = () => {
    if (nearestRsa) {
      setDispatchingMechanic(nearestRsa);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        selectedVehicle={selectedVehicle}
        soc={soc}
        safeRangeKm={safeRangeKm}
        isCritical={isCritical}
        onEmergencyTrigger={handleCallRsa}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-4">
        {/* Critical Emergency Banner (pops up when SOC <= 15%) */}
        {isCritical && (
          <EmergencyBanner
            soc={soc}
            safeRangeKm={safeRangeKm}
            selectedVehicle={selectedVehicle}
            nearestFastCharger={nearestFastCharger}
            nearestRsa={nearestRsa}
            onLockNearestCharger={handleLockNearestCharger}
            onCallRsa={handleCallRsa}
          />
        )}

        {/* Telemetry High-Level Stats Strip */}
        <TelemetryStats
          selectedVehicle={selectedVehicle}
          soc={soc}
          safeRangeKm={safeRangeKm}
          isCritical={isCritical}
          stations={enrichedInfrastructure}
        />

        {/* Grid: Controls & List (Left) vs Interactive Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Vehicle Picker, Range Slider, & Station List */}
          <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
            {/* 1. Vehicle Selector */}
            <VehicleSelector
              selectedVehicle={selectedVehicle}
              onSelectVehicle={(v) => {
                setSelectedVehicle(v);
                setSelectedStation(null);
              }}
            />

            {/* 2. Dynamic Range & Isochrone Engine (SOC Slider) */}
            <RangeSlider
              soc={soc}
              onSocChange={setSoc}
              safeRangeKm={safeRangeKm}
              selectedVehicle={selectedVehicle}
              isCritical={isCritical}
            />

            {/* 3. Triage List with Strict Hardware Gates */}
            <StationList
              stations={enrichedInfrastructure}
              safeRangeKm={safeRangeKm}
              selectedStation={selectedStation}
              selectedVehicle={selectedVehicle}
              onSelectStation={setSelectedStation}
              onLockStation={(st) => setLockingStation(st)}
              onCallStation={(st) => setDispatchingMechanic(st)}
            />
          </div>

          {/* Right Column: Full Leaflet Map with Dynamic Isochrone */}
          <div className="lg:col-span-7 h-[500px] sm:h-[600px] lg:h-[820px] sticky top-20 order-1 lg:order-2">
            <MapView
              selectedVehicle={selectedVehicle}
              soc={soc}
              safeRangeKm={safeRangeKm}
              isCritical={isCritical}
              stations={enrichedInfrastructure}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
              onLockStation={(st) => setLockingStation(st)}
              onCallStation={(st) => setDispatchingMechanic(st)}
            />
          </div>
        </div>

        {/* Engineering Footnote & Hardware Protocol Transparency */}
        <footer className="mt-8 pt-4 pb-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>VoltGuard Protocol Engine:</strong> 2W / 4W Hardware Separation active &bull; BMS 2% Reserve Buffer Protected
            </span>
          </div>
          <div className="text-[11px] font-mono-telemetry text-slate-400">
            Coordinates: NH-44 Toll Corridor (15.8281&deg; N, 78.0373&deg; E)
          </div>
        </footer>
      </main>

      {/* Modal 1: Lock Charging Gun */}
      <LockChargerModal
        station={lockingStation}
        selectedVehicle={selectedVehicle}
        soc={soc}
        isOpen={Boolean(lockingStation)}
        onClose={() => setLockingStation(null)}
      />

      {/* Modal 2: Emergency Flatbed / 2W RSA Dispatch */}
      <RsaDispatchModal
        mechanic={dispatchingMechanic}
        selectedVehicle={selectedVehicle}
        soc={soc}
        safeRangeKm={safeRangeKm}
        isOpen={Boolean(dispatchingMechanic)}
        onClose={() => setDispatchingMechanic(null)}
      />
    </div>
  );
}


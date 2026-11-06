/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Calculates Safe Range in KM based on the formula:
 * Safe_Range_Km = ((SOC - 2) / 100 * Battery_Capacity) / Consumption
 * (2% reserve buffer is protected against BMS deep-discharge shutdown)
 */
export function calculateSafeRange(soc, batteryCapacity, consumption) {
  if (soc <= 2) return 0;
  const usableKwh = ((soc - 2) / 100) * batteryCapacity;
  const range = usableKwh / consumption;
  return Number(range.toFixed(1));
}

/**
 * Calculates remaining battery percentage after driving distanceKm
 */
export function calculateEstimatedSocAtArrival(currentSoc, distanceKm, batteryCapacity, consumption) {
  const energyNeeded = distanceKm * consumption;
  const socDrop = (energyNeeded / batteryCapacity) * 100;
  const remaining = currentSoc - socDrop;
  return Math.max(0, Number(remaining.toFixed(1)));
}

/**
 * Calculate driving ETA in minutes based on realistic road speed (~45-60 km/h)
 */
export function calculateEtaMinutes(distanceKm) {
  if (distanceKm <= 0.1) return 1;
  const avgSpeedKmh = distanceKm > 15 ? 60 : 40;
  return Math.max(2, Math.round((distanceKm / avgSpeedKmh) * 60));
}


export const VEHICLES = [
  // 4-Wheelers
  {
    id: 'nexon-ev',
    name: 'Tata Nexon EV Empowered',
    type: '4W',
    batteryCapacity: 40.5, // kWh
    consumption: 0.14, // kWh/km
    connectors: ['CCS2', 'Type 2'],
    fastChargePower: '50 kW DC',
    nominalRange: 289, // km
    image: '🚙',
    brand: 'Tata Motors',
    tag: 'Long Range Compact SUV'
  },
  {
    id: 'mg-zs-ev',
    name: 'MG ZS EV Excite',
    type: '4W',
    batteryCapacity: 50.3, // kWh
    consumption: 0.16, // kWh/km
    connectors: ['CCS2'],
    fastChargePower: '50 kW DC',
    nominalRange: 314, // km
    image: '🚘',
    brand: 'MG Motor',
    tag: 'Executive Crossover'
  },
  {
    id: 'tiago-ev',
    name: 'Tata Tiago EV Long Range',
    type: '4W',
    batteryCapacity: 24.0, // kWh
    consumption: 0.12, // kWh/km
    connectors: ['CCS2'],
    fastChargePower: '25 kW DC',
    nominalRange: 200, // km
    image: '🚗',
    brand: 'Tata Motors',
    tag: 'City Hatchback'
  },
  // 2-Wheelers
  {
    id: 'ather-450x',
    name: 'Ather 450X Gen 3',
    type: '2W',
    batteryCapacity: 3.7, // kWh
    consumption: 0.035, // kWh/km
    connectors: ['Type 6', '16A 3-Pin'],
    fastChargePower: 'Ather Grid (1.5 km/min)',
    nominalRange: 105, // km
    image: '🛵',
    brand: 'Ather Energy',
    tag: 'Performance Smart Scooter'
  },
  {
    id: 'ola-s1-pro',
    name: 'Ola S1 Pro Gen 2',
    type: '2W',
    batteryCapacity: 4.0, // kWh
    consumption: 0.038, // kWh/km
    connectors: ['Hypercharger', '16A 3-Pin'],
    fastChargePower: 'Ola Hypercharger (75 km/15m)',
    nominalRange: 105, // km
    image: '🏍️',
    brand: 'Ola Electric',
    tag: 'Flagship Hyper Scooter'
  },
  {
    id: 'tvs-iqube',
    name: 'TVS iQube ST',
    type: '2W',
    batteryCapacity: 3.4, // kWh
    consumption: 0.034, // kWh/km
    connectors: ['16A 3-Pin'],
    fastChargePower: '650W Offboard / 16A',
    nominalRange: 100, // km
    image: '🛵',
    brand: 'TVS Motor',
    tag: 'Family Commuter'
  }
];

export const USER_LOCATION = {
  lat: 15.8281,
  lng: 78.0373,
  name: 'Current Vehicle Position (NH44 - Kurnool Junction)',
  label: 'NH-44 Toll Corridor, Kurnool'
};


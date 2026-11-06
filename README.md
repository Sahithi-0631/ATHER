# VoltGuard: Smart EV Reachability & Emergency Triage Platform (2W + 4W)

VoltGuard is a mission-critical, interactive single-page web application designed for electric vehicle drivers traversing the NH-44 highway corridor (Kurnool / Hyderabad sector). It provides live dynamic reachability calculations, physical hardware compatibility filtering, and roadside emergency triage.

---

## ⚡ Key Architecture & Features

### 1. Multi-Class Vehicle Profile Selector
- **4-Wheelers:**
  - **Tata Nexon EV Empowered**: 40.5 kWh battery, 0.14 kWh/km consumption, CCS2 & Type 2.
  - **MG ZS EV Excite**: 50.3 kWh battery, 0.16 kWh/km consumption, CCS2.
  - **Tata Tiago EV Long Range**: 24.0 kWh battery, 0.12 kWh/km consumption, CCS2.
- **2-Wheelers:**
  - **Ather 450X Gen 3**: 3.7 kWh battery, 0.035 kWh/km consumption, Type 6 Ather Grid & 16A.
  - **Ola S1 Pro Gen 2**: 4.0 kWh battery, 0.038 kWh/km consumption, Hypercharger & 16A 3-Pin.
  - **TVS iQube ST**: 3.4 kWh battery, 0.034 kWh/km consumption, 16A 3-Pin socket.

---

### 2. Dynamic Range & Isochrone Engine
- **Mathematical Formula**:
  $$\text{Safe Range (km)} = \frac{\frac{\text{SOC} - 2\%}{100} \times \text{Battery Capacity (kWh)}}{\text{Consumption (kWh/km)}}$$
- **BMS Protection Buffer**: Automatically reserves the bottom $2\%$ of SOC to protect the high-voltage battery against deep-discharge cell bricking and emergency limp shutdown.
- **Interactive Leaflet Circle**: Dynamically renders an isochrone perimeter centered at the vehicle's GPS coordinates (`lat: 15.8281, lng: 78.0373` on NH-44 Kurnool). The radius updates smoothly in real time as the SOC slider moves from 3% to 100%.

---

### 3. Strict Hardware Compatibility & Triage Filter
- **4-Wheeler Filter**:
  - Displays exclusively **CCS2 Fast DC** and **Type 2 AC** chargers.
  - Strictly hides low-power 2W sockets and scooter battery swap stations.
  - **Mechanics Triage**: Displays only **Certified EV Flatbed RSA** with clear warning: *Flatbed towing is strictly required because dragging wheels induces back-EMF voltage in permanent-magnet motors, causing catastrophic inverter burnout.*
- **2-Wheeler Filter**:
  - Displays **Ather Grid Type 6**, **16A industrial roadside dhaba sockets**, and **automated battery swap stations**.
  - Strictly hides 4W-only CCS2 DC guns.
  - **Mechanics Triage**: Displays **2W Mobile EV Repair & Pickup Towing** (specialized in carbon belt snaps, throttle deadband calibration, and BMS cold reboots).

---

### 4. Critical Emergency Mode ($\text{SOC} \le 15\%$)
- **Visual Alert**: Map reachability circle turns pulsing crimson, telemetry bar enters emergency status.
- **Emergency Action Banner**:
  - **Lock Nearest Fast Charger**: Instantly reserves a charging gun at the closest reachable fast station, issues a reservation token, and starts a 15-minute countdown hold with turn-by-turn navigation.
  - **Call Flatbed / 2W RSA**: Direct one-tap dispatcher linking driver telemetry and encrypted GPS payload directly to certified emergency responders.

---

### 5. Infrastructure Corridor Data (`src/data/ev_infrastructure.json`)
Includes 8 charging stations and 3 emergency triage units along the NH-44 corridor:
1. **Tata Power EZ Charge - Highway Junction Hub** (60 kW CCS2 + 22 kW Type 2)
2. **Ather Grid Fast Charger - Raj Vihar Point** (Type 6 Fast Dot + 16A)
3. **Jio-bp Pulse Hypercharger - Pullur Toll Hub** (120 kW CCS2)
4. **Highway Dhaba & 16A Emergency EV Socket - Veldurthi** (3.3 kW 16A)
5. **Zeon Ultra-Fast Hub - Food Pyramid Plaza** (120 kW CCS2)
6. **Battery Smart 2W Swap Station - Auto Nagar** (Automated Swap Pods)
7. **Statiq Smart EV Hub - Alampur Cross Point** (50 kW CCS2 + Type 2)
8. **HPCL Green Fuel Eco-Charge - Dhone NH-44** (60 kW CCS2 + 16A Industrial)
9. **SpeedX Certified EV Flatbed RSA - Kurnool Corridor** (4W Flatbed)
10. **VoltCare 2W Mobile EV Repair & Pickup Towing** (2W Mobile Triage)
11. **Highway Rescue Certified Flatbed RSA - South Hub** (4W Flatbed)

---

## 🛠️ Tech Stack
- **Vite 6** + **React 18**
- **Tailwind CSS** (Dark Cyberpunk / Automotive Telemetry HUD Theme)
- **Leaflet & React-Leaflet** (OpenStreetMap & CARTO dark basemap tiles)
- **Lucide React** (Hardware & telemetry iconography)

## 🚀 Running the App
The development server is running locally:
```bash
npm run dev
# Open http://localhost:3000/ in your browser
```


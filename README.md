# KisanRakshak Karnataka 🌾🛡️
> **"Protect Your Farm. Prepare Before Disaster."**  
> *Disaster-Resilient Agriculture Platform for Karnataka Farmers & Administrators*

---

## 1. Project Overview & Mission
**KisanRakshak Karnataka** is a dedicated full-stack agricultural disaster-preparedness application designed to help farmers protect their crops, seeds, water, livestock, farm machinery, and stored materials **BEFORE** natural calamities strike.

### Core Workflow:
```
MONITOR ➜ DETECT RISK ➜ WARN FARMER ➜ RECOMMEND ACTION ➜ FARMER PROTECTS RESOURCES ➜ CONFIRM PROTECTION ➜ REDUCE LOSS ➜ RECOVER
```

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion
- **Backend**: Java 17, Spring Boot 3.2.3, Spring Data JPA, Spring Security, JWT, Lombok
- **Database**: MySQL 8.0 with InnoDB relational schema and transactional integrity
- **Weather Radar**: Real Open-Meteo Karnataka meteorological integration across 31 districts
- **Packaging**: In-app JSZip engine that bundles the full-stack codebase into a downloadable archive in one click!

---

## 3. Folder Structure

```
kisanrakshak/
├── database/
│   └── schema.sql                  # Complete MySQL 8.0 DDL & seed dataset
├── backend/
│   ├── pom.xml                     # Maven dependencies (Spring Boot, Security, JPA, JWT)
│   ├── src/main/resources/
│   │   ├── application.properties  # Database, JWT & server configs
│   │   └── data.sql                # Seed roles and sample entries
│   └── src/main/java/com/kisanrakshak/
│       ├── config/SecurityConfig.java
│       ├── controller/             # Auth, Farms, Weather, Alerts, Loss Reports
│       └── KisanRakshakApplication.java
├── src/
│   ├── components/
│   │   ├── common/                 # Header, Sidebar, MobileBottomNav, TerminalModal
│   │   ├── farmer/                 # WeatherCard, RiskCard, 6-Step Plan, Crop, Seed, Water
│   │   ├── admin/                  # Disaster Control, Farmer Directory, Claims Review
│   │   └── public/                 # Landing Page, Login & Register
│   ├── context/                    # AuthContext (Role Switcher), LanguageContext (Bilingual EN/KN)
│   ├── services/                   # Live Open-Meteo Weather, Risk Engine, JSZip Exporter
│   ├── types/                      # Comprehensive TypeScript definitions
│   ├── App.tsx                     # Top-level view routing & layout
│   └── index.css                   # Agriculture clean white design system
├── .env.example                    # Environment variable template
├── package.json
└── README.md
```

---

## 4. Demo User Credentials

| Role | Mobile / ID | Password | Persona | Responsibilities |
|---|---|---|---|---|
| **Farmer** | `9845012345` | `farmer123` | **Ramesh Kumar** | Kalaburagi (5.2 Acres Tur & Jowar, Borewell, 6 Cattle, 80kg Tur Seeds) |
| **Admin** | `9448099887` | `admin123` | **Dr. Siddharamaiah M.** | Joint Director of Agriculture & KSNDMC State Disaster Control |

*Tip: You can seamlessly switch personas anytime from the top navigation dropdown or login screen.*

---

## 5. How to Run Locally in VS Code (Zero Error Quick Start)

### 🚀 Instant 2-Step Launch (Vite React + TypeScript):
```bash
# 1. Install Node dependencies
npm install

# 2. Start the development server
npm run dev
```
Open your browser at **`http://localhost:3000`** — the full app runs with live Open-Meteo weather radar, all 8+ Karnataka disaster reels, offline storage, role switcher, and document vault.

---

### ☕ Full-Stack Backend (Optional):
- **Express Backend**: Run `npm run server` (runs on `http://localhost:3000`)
- **Spring Boot Backend**: `cd backend && mvn spring-boot:run` (runs on `http://localhost:8080`)
- **MySQL 8.0 Schema**: Located at `database/schema.sql` (can be imported into MySQL Workbench or phpMyAdmin)

---

## 6. Real Weather API Integration
The weather engine connects to **Open-Meteo** using high-precision geographical coordinates for Karnataka taluks (e.g. Kalaburagi: `17.3297, 76.8343`, Belagavi: `15.8497, 74.4977`, Bengaluru: `12.9716, 77.5946`).
- Real-time temperature & apparent "feels like"
- Relative humidity & wind speed
- 24-hour precipitation forecast (mm)
- Next hours trend and 7-day agricultural outlook
- Automatic cached fallback mode ensures zero downtime during rural network interruptions.

---

## 7. Interactive Terminal & ZIP Export Feature
The platform includes:
1. **In-App Terminal**: Click the **"Terminal"** button in the header to run virtual CLI commands like `mvn spring-boot:run`, `npm run dev`, `mysql status`, and `weather test`.
2. **Download Complete ZIP Package**: Click the **"Download ZIP"** button to automatically bundle and download the entire full-stack project archive (`KisanRakshak-Karnataka-FullStack.zip`) containing frontend, backend, MySQL schema, and runner scripts.

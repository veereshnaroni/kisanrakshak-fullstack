import {
  User,
  FarmerProfile,
  Farm,
  Crop,
  SeedStock,
  WaterResource,
  Livestock,
  FarmAsset,
  StorageUnit,
  DocumentRecord,
  DisasterAlert,
  LossReport,
  RecoveryTask,
  GovernmentScheme,
  AssistanceRequest,
  AuditLog,
  ProtectionStep,
  DisasterReel,
} from '../types';

// Demo Farmers & Admin
export const DEMO_USERS: User[] = [
  {
    id: 'usr-farmer-1',
    name: 'Veeresh Narooni',
    mobile: '9845012345',
    email: 'veereshbnarooni@gmail.com',
    role: 'ROLE_FARMER',
    district: 'Kalaburagi',
    taluk: 'Kalaburagi',
    village: 'Sultanpur Village',
  },
  {
    id: 'usr-admin-1',
    name: 'Dr. Siddharamaiah M.',
    mobile: '9448099887',
    email: 'admin.agriculture@karnataka.gov.in',
    role: 'ROLE_ADMIN',
    district: 'Kalaburagi',
    taluk: 'Kalaburagi',
    village: 'District Agriculture Complex',
  },
];

export const INITIAL_FARM: Farm = {
  id: 'farm-1',
  userId: 'usr-farmer-1',
  name: 'Veeresh Organic Farm',
  district: 'Kalaburagi',
  taluk: 'Kalaburagi',
  village: 'Sultanpur Village',
  surveyNumber: 'Sy. No. 142/2B',
  areaAcres: 5.2,
  soilType: 'Black Soil',
  irrigationType: 'Borewell',
  waterSource: 'Deep Borewell (450 ft) + Krishi Honda',
  latitude: 17.3297,
  longitude: 76.8343,
  riskScore: 38,
  riskCategory: 'MODERATE',
};

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'crop-1',
    farmId: 'farm-1',
    name: 'Tur (Pigeon Pea / ತೊಗರಿ)',
    kannadaName: 'ತೊಗರಿ',
    variety: 'GRG-811 (Karnataka Agricultural University)',
    areaAcres: 3.5,
    sowingDate: '2026-06-28',
    expectedHarvestDate: '2026-11-20',
    growthStage: 'Flowering',
    irrigationMethod: 'Drip & Rainfed',
    condition: 'Good',
    vulnerabilityTo: ['Waterlogging', 'Pod Borer', 'Wilt Disease'],
  },
  {
    id: 'crop-2',
    farmId: 'farm-1',
    name: 'Jowar (Sorghum / ಜೋಳ)',
    kannadaName: 'ಜೋಳ',
    variety: 'M 35-1 (Maldandi)',
    areaAcres: 1.7,
    sowingDate: '2026-07-10',
    expectedHarvestDate: '2026-10-30',
    growthStage: 'Pod Formation',
    irrigationMethod: 'Protective Irrigation',
    condition: 'Excellent',
    vulnerabilityTo: ['Stem Borer', 'Lodging due to High Wind'],
  },
];

export const INITIAL_SEEDS: SeedStock[] = [
  {
    id: 'seed-1',
    farmId: 'farm-1',
    seedType: 'Certified Foundation Seed',
    crop: 'Tur (GRG-811)',
    quantityKg: 80,
    season: 'Kharif',
    storageLocation: 'Farm Store Room (Elevated Wooden Rack)',
    storageCondition: 'Safe & Dry',
    lastCheckedDate: '2026-10-02',
    checklist: {
      dryStorage: true,
      elevatedPlatform: true,
      waterproofCover: true,
      rodentProof: true,
      wellVentilated: true,
    },
  },
  {
    id: 'seed-2',
    farmId: 'farm-1',
    seedType: 'High Yielding Variety (HYV)',
    crop: 'Bengal Gram (Chickpea / ಕಡಲೆ)',
    quantityKg: 50,
    season: 'Rabi',
    storageLocation: 'Elevated Metal Grain Silo',
    storageCondition: 'Safe & Dry',
    lastCheckedDate: '2026-10-01',
    checklist: {
      dryStorage: true,
      elevatedPlatform: true,
      waterproofCover: true,
      rodentProof: true,
      wellVentilated: false,
    },
  },
];

export const INITIAL_WATER: WaterResource[] = [
  {
    id: 'wat-1',
    farmId: 'farm-1',
    sourceType: 'Borewell',
    sourceName: 'Primary Agriculture Borewell',
    capacityLiters: 120000,
    currentAvailabilityPercent: 74,
    irrigatedAreaAcres: 4.0,
    depthFeet: 420,
    lastCheckedDate: '2026-10-03',
    status: 'Adequate',
    rechargeStructureWorking: true,
  },
  {
    id: 'wat-2',
    farmId: 'farm-1',
    sourceType: 'Farm Pond (Krishi Honda)',
    sourceName: 'Govt. Subsidized Krishi Honda 20x20m',
    capacityLiters: 250000,
    currentAvailabilityPercent: 85,
    irrigatedAreaAcres: 1.2,
    depthFeet: 12,
    lastCheckedDate: '2026-10-02',
    status: 'Abundant',
    rechargeStructureWorking: true,
  },
];

export const INITIAL_LIVESTOCK: Livestock[] = [
  {
    id: 'live-1',
    farmId: 'farm-1',
    animalType: 'Cattle (Cow/Ox)',
    breed: 'Khillari Indigenous Draught Breed',
    count: 4,
    shelterType: 'Pukka Shed',
    feedStockDays: 24,
    waterAvailabilityLitersDaily: 350,
    safetyStatus: 'SAFE',
    vaccinated: true,
  },
  {
    id: 'live-2',
    farmId: 'farm-1',
    animalType: 'Buffalo',
    breed: 'Murrah Cross',
    count: 2,
    shelterType: 'Pukka Shed',
    feedStockDays: 24,
    waterAvailabilityLitersDaily: 200,
    safetyStatus: 'SAFE',
    vaccinated: true,
  },
];

export const INITIAL_ASSETS: FarmAsset[] = [
  {
    id: 'ast-1',
    farmId: 'farm-1',
    name: 'Mahindra 475 DI Tractor (42 HP)',
    category: 'Tractor',
    quantity: 1,
    storageLocation: 'Covered Implement Shed (Elevated)',
    estimatedValueInr: 650000,
    protectionStatus: 'SAFE',
    securedAgainstFlood: true,
  },
  {
    id: 'ast-2',
    farmId: 'farm-1',
    name: 'CRI 7.5 HP Submersible Pump & Starter',
    category: 'Submersible Pump',
    quantity: 1,
    storageLocation: 'Borewell Head Chamber',
    estimatedValueInr: 45000,
    protectionStatus: 'PROTECTED',
    securedAgainstFlood: true,
  },
  {
    id: 'ast-3',
    farmId: 'farm-1',
    name: 'Solar Powered Sprayer (16 Liters)',
    category: 'Sprayer Equipment',
    quantity: 2,
    storageLocation: 'Secure Store Room Shelf',
    estimatedValueInr: 12000,
    protectionStatus: 'SAFE',
    securedAgainstFlood: true,
  },
  {
    id: 'ast-4',
    farmId: 'farm-1',
    name: 'Neem-coated Urea & DAP Fertilizer (12 Bags)',
    category: 'Fertilizer Stock',
    quantity: 12,
    storageLocation: 'Dry Warehouse on Wooden Skids',
    estimatedValueInr: 18000,
    protectionStatus: 'PROTECTED',
    securedAgainstFlood: true,
  },
];

export const INITIAL_STORAGE: StorageUnit[] = [
  {
    id: 'str-1',
    farmId: 'farm-1',
    unitName: 'Primary Pucca Godown',
    type: 'Seed Storage',
    elevationAboveGroundCm: 45,
    isWaterproofRoof: true,
    isPestProtected: true,
    isVentilated: true,
    readinessPercentage: 92,
  },
  {
    id: 'str-2',
    farmId: 'farm-1',
    unitName: 'Implement & Tool Shed',
    type: 'Implement Shed',
    elevationAboveGroundCm: 25,
    isWaterproofRoof: true,
    isPestProtected: false,
    isVentilated: true,
    readinessPercentage: 80,
  },
];

export const INITIAL_DOCS: DocumentRecord[] = [
  {
    id: 'doc-1',
    userId: 'usr-farmer-1',
    title: 'Pahani / RTC Record 2025-2026',
    docType: 'RTC / Pahani (Land Record)',
    fileName: 'pahani_sy142_kalaburagi.pdf',
    uploadDate: '2026-08-14',
    verificationStatus: 'VERIFIED',
    fileSizeKb: 412,
  },
  {
    id: 'doc-2',
    userId: 'usr-farmer-1',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) Policy',
    docType: 'Crop Insurance (PMFBY)',
    fileName: 'pmfby_tur_coverage_2026.pdf',
    uploadDate: '2026-07-22',
    verificationStatus: 'VERIFIED',
    fileSizeKb: 680,
  },
  {
    id: 'doc-3',
    userId: 'usr-farmer-1',
    title: 'Canara Bank Kisan Credit Card Record',
    docType: 'Kisan Credit Card (KCC)',
    fileName: 'kcc_passbook_scan.pdf',
    uploadDate: '2026-06-10',
    verificationStatus: 'VERIFIED',
    fileSizeKb: 540,
  },
];

export const INITIAL_PROTECTION_STEPS: ProtectionStep[] = [
  {
    stepNumber: 1,
    code: 'STEP_1',
    title: 'Weather & Risk Monitoring',
    titleKn: 'ಹವಾಮಾನ ಮತ್ತು ಅಪಾಯದ ನಿಗಾವಹಿಸುವಿಕೆ',
    description: 'Track real-time rainfall forecasts, wind warnings, and automated risk indices daily.',
    iconName: 'CloudRain',
    status: 'COMPLETED',
    progressPercentage: 100,
    checklist: [
      { id: 'chk-1-1', text: 'Checked 24h & 7-day rainfall advisory for Kalaburagi taluk', completed: true, importance: 'Essential' },
      { id: 'chk-1-2', text: 'Enabled WhatsApp/SMS automated alert notifications', completed: true, importance: 'Essential' },
      { id: 'chk-1-3', text: 'Synced soil moisture & wind velocity indicators', completed: true, importance: 'Recommended' },
    ],
  },
  {
    stepNumber: 2,
    code: 'STEP_2',
    title: 'Drainage & Crop Protection',
    titleKn: 'ಬೆಳೆ ರಕ್ಷಣೆ ಮತ್ತು ಒಳಚರಂಡಿ ಸ್ವಚ್ಛತೆ',
    description: 'Ensure standing water does not stagnate in the root zone; safeguard flowering stage.',
    iconName: 'Sprout',
    status: 'IN_PROGRESS',
    progressPercentage: 75,
    checklist: [
      { id: 'chk-2-1', text: 'Cleared main field drainage bunds and outlet pipes', completed: true, importance: 'Essential' },
      { id: 'chk-2-2', text: 'Constructed peripheral interception trenches for flood run-off', completed: true, importance: 'Essential' },
      { id: 'chk-2-3', text: 'Staked tall Jowar and wind-prone varieties', completed: false, importance: 'Recommended' },
      { id: 'chk-2-4', text: 'Postponed pesticide spray 48h prior to rainfall', completed: true, importance: 'Essential' },
    ],
  },
  {
    stepNumber: 3,
    code: 'STEP_3',
    title: 'Livestock Safety & Shelter',
    titleKn: 'ಜಾನುವಾರುಗಳ ಸುರಕ್ಷತೆ ಮತ್ತು ಆಶ್ರಯ',
    description: 'Prevent livestock casualties, waterborne epidemics, and secure fodder supplies.',
    iconName: 'HeartHandshake',
    status: 'IN_PROGRESS',
    progressPercentage: 66,
    checklist: [
      { id: 'chk-3-1', text: 'Inspected shelter roof tiles and secured structural poles', completed: true, importance: 'Essential' },
      { id: 'chk-3-2', text: 'Stored 21 days dry fodder on raised platforms under cover', completed: true, importance: 'Essential' },
      { id: 'chk-3-3', text: 'Prepared emergency halogen lamps and portable drinking troughs', completed: false, importance: 'Recommended' },
      { id: 'chk-3-4', text: 'Confirmed Foot-and-Mouth (FMD) booster vaccination', completed: true, importance: 'Essential' },
    ],
  },
  {
    stepNumber: 4,
    code: 'STEP_4',
    title: 'Secure Elevated Storage (Seeds & Fertilizer)',
    titleKn: 'ಸುರಕ್ಷಿತ ಗೋದಾಮು (ಬೀಜ ಮತ್ತು ಗೊಬ್ಬರ)',
    description: 'Safeguard foundation seeds, fertilizers, and harvested produce from moisture damage.',
    iconName: 'Warehouse',
    status: 'COMPLETED',
    progressPercentage: 100,
    checklist: [
      { id: 'chk-4-1', text: 'Stack seed sacks at least 30 cm above floor on wooden dunnage', completed: true, importance: 'Essential' },
      { id: 'chk-4-2', text: 'Keep bags 60 cm away from perimeter walls to avoid dampness', completed: true, importance: 'Essential' },
      { id: 'chk-4-3', text: 'Wrap stacks in heavy gauge UV-stabilized polythene sheets', completed: true, importance: 'Essential' },
      { id: 'chk-4-4', text: 'Seal store doors against rodents and surface runoff ingress', completed: true, importance: 'Recommended' },
    ],
  },
  {
    stepNumber: 5,
    code: 'STEP_5',
    title: 'Document & Financial Records Safety',
    titleKn: 'ದಾಖಲೆಗಳು ಮತ್ತು ವಿಮಾ ಭದ್ರತೆ',
    description: 'Digitize RTC/Pahani, bank passbooks, and insurance policies in waterproof envelopes.',
    iconName: 'FileCheck',
    status: 'COMPLETED',
    progressPercentage: 100,
    checklist: [
      { id: 'chk-5-1', text: 'Uploaded digital copies of RTC, PMFBY policy, and Aadhaar to portal', completed: true, importance: 'Essential' },
      { id: 'chk-5-2', text: 'Physical original documents stored in sealed waterproof zip pouches', completed: true, importance: 'Essential' },
      { id: 'chk-5-3', text: 'Noted claim toll-free number (1800-180-1551) in dairy', completed: true, importance: 'Recommended' },
    ],
  },
  {
    stepNumber: 6,
    code: 'STEP_6',
    title: 'Emergency Response & Community Plan',
    titleKn: 'ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ಮತ್ತು ಸಮುದಾಯ ಯೋಜನೆ',
    description: 'Establish direct phone contact with Village Accountant, Agriculture Officer, and neighbors.',
    iconName: 'PhoneCall',
    status: 'IN_PROGRESS',
    progressPercentage: 50,
    checklist: [
      { id: 'chk-6-1', text: 'Saved contact numbers of Raitha Samparka Kendra officer', completed: true, importance: 'Essential' },
      { id: 'chk-6-2', text: 'Identified community high-ground shelter for livestock evacuation', completed: true, importance: 'Essential' },
      { id: 'chk-6-3', text: 'Tested tractor battery and filled backup diesel canister (20L)', completed: false, importance: 'Recommended' },
      { id: 'chk-6-4', text: 'Connected with Gram Panchayat disaster committee lead', completed: false, importance: 'Recommended' },
    ],
  },
];

export const INITIAL_ALERTS: DisasterAlert[] = [
  {
    id: 'alt-kal-01',
    title: 'Heavy Rainfall & Waterlogging Warning',
    titleKn: 'ಭಾರಿ ಮಳೆ ಮತ್ತು ಜಲಾವೃತ ಎಚ್ಚರಿಕೆ',
    disasterType: 'HEAVY_RAIN',
    severity: 'WARNING',
    districts: ['Kalaburagi', 'Belagavi', 'Vijayapura'],
    taluks: ['Kalaburagi', 'Aland', 'Afzalpur', 'Chittapur'],
    issuedAt: '2026-10-04T06:00:00Z',
    validUntil: '2026-10-06T18:00:00Z',
    description: 'Active monsoon trough causing sustained intense rainfall (65-90 mm expected in 24h) across northern Karnataka black soil belts.',
    farmImpact: 'High risk of waterlogging in black soils, root decay in flowering Tur, and localized flash runoff in low-lying bunds.',
    affectedResources: ['Tur Crops', 'Jowar', 'Low-elevation Seed Storage', 'Borewell Open Starters', 'Cattle Sheds'],
    recommendedActions: [
      'Dig trench outlets at lower field boundaries immediately to purge excess standing water.',
      'Elevate all seed bags at least 30 cm from ground onto wooden pallets.',
      'Disconnect open electrical starters at borewells to avoid surge burnouts.',
      'Move tethered cattle to higher ground if shed floor is prone to stagnation.',
    ],
    createdBy: 'Directorate of Agriculture, Bengaluru & KSNDMC',
    isActive: true,
  },
  {
    id: 'alt-bel-02',
    title: 'High Wind Velocity & Squall Advisory',
    titleKn: 'ಭಾರಿ ಗಾಳಿ ಮತ್ತು ಬಿರುಗಾಳಿ ಸಲಹೆ',
    disasterType: 'CYCLONIC_WINDS',
    severity: 'WATCH',
    districts: ['Belagavi', 'Dharwad'],
    taluks: ['Chikkodi', 'Gokak', 'Athani'],
    issuedAt: '2026-10-03T12:00:00Z',
    validUntil: '2026-10-05T20:00:00Z',
    description: 'Gusty surface winds reaching 40-50 km/h anticipated along river basin corridors.',
    farmImpact: 'Potential lodging in tall sugarcane and sorghum stalks; roof sheet displacement on sheds.',
    affectedResources: ['Sugarcane', 'Horticultural Polyhouses', 'Shed Roofing'],
    recommendedActions: [
      'Tie and propping sugarcane clumps together.',
      'Check fasteners on galvanized iron sheets on implement shelters.',
    ],
    createdBy: 'KSNDMC Weather Center',
    isActive: true,
  },
];

export const INITIAL_LOSS_REPORTS: LossReport[] = [
  {
    id: 'rep-2026-081',
    farmerId: 'usr-farmer-1',
    farmerName: 'Veeresh Narooni',
    mobile: '9845012345',
    district: 'Kalaburagi',
    taluk: 'Kalaburagi',
    village: 'Sultanpur Village',
    farmName: 'Veeresh Organic Farm',
    disasterType: 'Flash Flood & Waterlogging (August 2026 Event)',
    affectedResource: 'Crops',
    resourceDetails: 'Tur Crop (GRG-811) in Sy. No. 142/2B (Lower Acreage)',
    damageDescription: 'Submerged under 1.5 ft standing floodwater for 48 hours following heavy cloudburst, causing root collar rot and 30% flowering drop.',
    estimatedLossInr: 45000,
    affectedAcreageOrUnits: '1.5 Acres',
    photosUploaded: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80',
    ],
    reportedAt: '2026-08-20T10:30:00Z',
    status: 'VERIFIED',
    officialRemarks: 'Inspected by Assistant Agriculture Officer (AAO). Loss assessed at 28%. Recommended for input subsidy under State Disaster Response Fund (SDRF).',
    compensationSanctionedInr: 18500,
  },
];

export const INITIAL_RECOVERY_TASKS: RecoveryTask[] = [
  {
    id: 'rec-1',
    farmerId: 'usr-farmer-1',
    phase: 'Immediate (0-7 Days)',
    taskTitle: 'Drain remaining standing water from field furrows',
    category: 'Soil Remediation',
    isCompleted: true,
    guidance: 'Aerate soil surface to allow oxygen penetration into roots and prevent collar rot fungal proliferation.',
  },
  {
    id: 'rec-2',
    farmerId: 'usr-farmer-1',
    phase: 'Immediate (0-7 Days)',
    taskTitle: 'Foliar spray of 1% Urea + 1% Potassium Nitrate (KNO3)',
    category: 'Soil Remediation',
    isCompleted: true,
    guidance: 'Provides instantaneous nutrition to shocked surviving plants once sun emerges.',
  },
  {
    id: 'rec-3',
    farmerId: 'usr-farmer-1',
    phase: 'Rebuilding (1-4 Weeks)',
    taskTitle: 'Obtain subsidised Rabi Chickpea (Bengal Gram) seeds from RSK',
    category: 'Replanting',
    isCompleted: false,
    guidance: 'Prepare for compensatory Rabi sowing on cleared land using moisture retained in black soil.',
  },
  {
    id: 'rec-4',
    farmerId: 'usr-farmer-1',
    phase: 'Long Term Restructure',
    taskTitle: 'Construct permanent stone pitching along drainage exit',
    category: 'Irrigation Repair',
    isCompleted: false,
    guidance: 'Enlist under MGNREGA farm pond / drainage bund deepening scheme to reinforce field edges.',
  },
];

export const INITIAL_SCHEMES: GovernmentScheme[] = [
  {
    id: 'sch-pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    nameKn: 'ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (ವಿಮೆ)',
    department: 'Ministry of Agriculture & Farmers Welfare / Karnataka Agriculture Dept.',
    purpose: 'Comprehensive financial support against non-preventable natural risks (drought, flood, hailstorm, post-harvest losses).',
    eligibilityCriteria: [
      'All farmers cultivating notified crops in notified areas (loanee and non-loanee).',
      'Valid RTC / Pahani in Karnataka Bhoomi portal.',
      'Sowing certificate issued by Village Accountant or self-declaration via Samrakshane portal.',
    ],
    benefits: 'Covers pre-sowing failure, standing crop damage, mid-season adversity, and localized calamities up to 100% of sum insured.',
    requiredDocuments: ['Aadhaar Card', 'RTC / Pahani', 'Bank Account Passbook (Aadhaar linked)', 'Crop Sowing Certificate'],
    officialPortalUrl: 'https://samrakshane.karnataka.gov.in',
    helpline: '1800-425-3553 / 1800-180-1551',
    isActive: true,
  },
  {
    id: 'sch-sdrf',
    name: 'Karnataka State Disaster Response Fund (SDRF) Crop Input Subsidy',
    nameKn: 'ರಾಜ್ಯ ವಿಪತ್ತು ಪರಿಹಾರ ನಿಧಿ (ಇನ್‌ಪುಟ್ ಸಬ್ಸಿಡಿ)',
    department: 'Karnataka Revenue Department & Disaster Management Authority',
    purpose: 'Immediate cash assistance for agriculture input loss when crop damage exceeds 33% due to floods or drought.',
    eligibilityCriteria: [
      'Crop loss must exceed 33% certified during joint field enumeration.',
      'Direct landholders registered on Bhoomi & FRUITS database with FID number.',
    ],
    benefits: '₹8,500/hectare for rainfed crops, ₹17,000/hectare for irrigated crops directly credited via DBT.',
    requiredDocuments: ['FRUITS ID (FID)', 'Aadhaar Card', 'Bank IFSC Details'],
    officialPortalUrl: 'https://fruits.karnataka.gov.in',
    helpline: '080-22340676 / 1077 (District Control Room)',
    isActive: true,
  },
  {
    id: 'sch-krishi-honda',
    name: 'Krishi Bhagya Scheme - Farm Pond (ಕೃಷಿ ಹೊಂಡ) with Polythene Lining',
    nameKn: 'ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ - ಕೃಷಿ ಹೊಂಡ',
    department: 'Department of Agriculture, Govt. of Karnataka',
    purpose: 'Harvesting rainwater runoff to ensure critical protective irrigation during mid-season dry spells and flood control.',
    eligibilityCriteria: ['Dryland / rainfed farmers owning at least 1 acre of cultivable land in Karnataka.'],
    benefits: '80% subsidy for SC/ST farmers and 50% for general category farmers for pond excavation, tarpaulin lining, and diesel pump sets.',
    requiredDocuments: ['RTC', 'Caste Certificate (if SC/ST)', 'Bank Passbook', 'Passport Photo'],
    officialPortalUrl: 'https://raitamitra.karnataka.gov.in',
    helpline: '080-22212804',
    isActive: true,
  },
];

export const INITIAL_ASSISTANCE: AssistanceRequest[] = [
  {
    id: 'ast-req-101',
    farmerId: 'usr-farmer-1',
    farmerName: 'Veeresh Narooni',
    mobile: '9845012345',
    district: 'Kalaburagi',
    taluk: 'Kalaburagi',
    problem: 'Standing water accumulation near cattle shed; need emergency diesel de-watering pump.',
    disasterCategory: 'Heavy Rain / Flood',
    priority: 'HIGH',
    requiredHelp: 'Drainage Pump',
    assignedOfficer: 'Basavaraj AAO (Sultanpur RSK)',
    status: 'ASSIGNED',
    createdAt: '2026-10-04T07:15:00Z',
  },
];

export const INITIAL_DISASTER_REELS: DisasterReel[] = [
  {
    id: 'reel-kal-01',
    authorName: 'Sharanappa Biradar',
    authorRole: 'FARMER',
    district: 'Kalaburagi',
    taluk: 'Afzalpur',
    village: 'Mashal (Bhima River Basin)',
    disasterType: 'FLOOD_INUNDATION',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
    title: 'ಭೀಮಾ ನದಿ ಪ್ರವಾಹ: 5 ಎಕರೆ ಹೂಬಿಡುವ ತೊಗರಿ ಬೆಳೆ ಸಂಪೂರ್ಣ ಮುಳುಗಡೆ',
    titleKn: 'ಭೀಮಾ ನದಿ ಪ್ರವಾಹ: 5 ಎಕರೆ ಹೂಬಿಡುವ ತೊಗರಿ ಬೆಳೆ ಸಂಪೂರ್ಣ ಮುಳುಗಡೆ',
    description: 'Bhima river overflowed after 1.8 Lakh cusecs water discharge from Sonna barrage. 5 Acres flowering Tur crop is standing under 4 feet water. Urgent diesel dewatering pump needed.',
    descriptionKn: 'ಸೊನ್ನ ಬ್ಯಾರೇಜ್‌ನಿಂದ ಅಪಾರ ನೀರು ಬಿಟ್ಟಿದ್ದರಿಂದ ಹೊಲಕ್ಕೆ ನೀರು ನುಗ್ಗಿದೆ. 5 ಎಕರೆ ತೊಗರಿ ಬೆಳೆ ಮುಳುಗಿದೆ. ಕಂದಾಯ ಅಧಿಕಾರಿಗಳು ಸಮೀಕ್ಷೆ ನಡೆಸಲು ವಿನಂತಿ.',
    cropAffected: 'Tur / Pigeon Pea (ತೊಗರಿ)',
    estimatedLoss: '5.2 Acres Submerged • Estimated Loss: ₹2,40,000',
    surveyNumber: 'Sy. No. 88/1A',
    timestamp: '2026-10-04 07:30 AM',
    likesCount: 142,
    isLiked: false,
    sharesCount: 38,
    verifiedByGovt: true,
    reliefStatus: 'Immediate Action Needed',
    tags: ['#KalaburagiFloods', '#TurCropLoss', '#BhimaRiver', '#Afzalpur'],
  },
  {
    id: 'reel-bel-02',
    authorName: 'Assistant Director of Agriculture',
    authorRole: 'OFFICER',
    district: 'Belagavi',
    taluk: 'Gokak',
    village: 'Daddi / Ghataprabha Basin',
    disasterType: 'CANAL_BREACH',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
    title: 'ಘಟಪ್ರಭಾ ನಾಲಾ ಒಡೆದು 80 ಎಕರೆ ಕಬ್ಬಿನ ತೋಟಗಳಿಗೆ ನೀರು',
    titleKn: 'ಘಟಪ್ರಭಾ ನಾಲಾ ಒಡೆದು 80 ಎಕರೆ ಕಬ್ಬಿನ ತೋಟಗಳಿಗೆ ನೀರು',
    description: 'Ghataprabha right bank canal breached near Daddi. Joint inspection by Revenue & Agriculture department is underway. SDRF relief claim camp established at Gokak Taluk office.',
    descriptionKn: 'ಘಟಪ್ರಭಾ ಬಲದಂಡೆ ನಾಲೆ ಒಡೆದಿದ್ದು, ಕೃಷಿ ಇಲಾಖೆಯಿಂದ ಜಂಟಿ ಪರಿಶೀಲನೆ ಆರಂಭವಾಗಿದೆ. ಸಂತ್ರಸ್ತ ರೈತರು ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸಲು ಸೂಚಿಸಲಾಗಿದೆ.',
    cropAffected: 'Sugarcane (ಕಬ್ಬು)',
    estimatedLoss: '82 Acres Inundated • Est Loss: ₹14,80,000',
    surveyNumber: 'Sy. No. 214/1 to 214/8',
    timestamp: '2026-10-04 06:45 AM',
    likesCount: 289,
    isLiked: true,
    sharesCount: 95,
    verifiedByGovt: true,
    reliefStatus: 'SDRF Survey Underway',
    tags: ['#BelagaviFloods', '#Gokak', '#SugarcaneLoss', '#CanalBreach'],
  },
  {
    id: 'reel-rai-03',
    authorName: 'Veeresh Patil',
    authorRole: 'FARMER',
    district: 'Raichur',
    taluk: 'Manvi',
    village: 'Kurdi',
    disasterType: 'CLOUDBURST_RAIN',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&auto=format&fit=crop&q=80',
    title: 'ಧಾರಾಕಾರ ಮಳೆಗೆ ಹತ್ತಿ ಗಿಡಗಳ ಕಾಯಿ ಉದುರಿ ತೀವ್ರ ಹಾನಿ',
    titleKn: 'ಧಾರಾಕಾರ ಮಳೆಗೆ ಹತ್ತಿ ಗಿಡಗಳ ಕಾಯಿ ಉದುರಿ ತೀವ್ರ ಹಾನಿ',
    description: '115mm continuous cloudburst in 3 hours caused severe soil erosion and boll dropping in Bt-Cotton crop. Requesting immediate field survey for crop insurance.',
    descriptionKn: 'ಕೇವಲ 3 ಗಂಟೆಯಲ್ಲಿ ಸುರಿದ ಭಾರೀ ಮಳೆಯಿಂದ ಹತ್ತಿ ಗಿಡಗಳ ಕಾಯಿಗಳು ಉದುರಿವೆ. ನೆಲದಲ್ಲಿ ನೀರು ನಿಂತು ಬೇರುಗಳು ಕೊಳೆಯುತ್ತಿವೆ.',
    cropAffected: 'Bt-Cotton (ಹತ್ತಿ)',
    estimatedLoss: '8.0 Acres • Estimated Loss: ₹3,80,000',
    surveyNumber: 'Sy. No. 42/3',
    timestamp: '2026-10-03 05:20 PM',
    likesCount: 96,
    isLiked: false,
    sharesCount: 21,
    verifiedByGovt: false,
    reliefStatus: 'Alert Broadcasted',
    tags: ['#Raichur', '#CottonDamage', '#Cloudburst', '#Manvi'],
  },
  {
    id: 'reel-vij-04',
    authorName: 'Basavaraj G (Krishi Mitra)',
    authorRole: 'KRISHI_VIGYAN_KENDRA',
    district: 'Vijayapura',
    taluk: 'Sindagi',
    village: 'Golageri',
    disasterType: 'HAILSTORM_DAMAGE',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&auto=format&fit=crop&q=80',
    title: 'ಆಲಿಕಲ್ಲು ಮಳೆಗೆ ದಾಳಿಂಬೆ ಮತ್ತು ದ್ರಾಕ್ಷಿ ತೋಟ ಧ್ವಂಸ',
    titleKn: 'ಆಲಿಕಲ್ಲು ಮಳೆಗೆ ದಾಳಿಂಬೆ ಮತ್ತು ದ್ರಾಕ್ಷಿ ತೋಟ ಧ್ವಂಸ',
    description: 'Severe golf ball-sized hailstorm destroyed 12 acres of ready-to-harvest export quality Pomegranate and Sonaka grapes. KVK advisory issued on anti-fungal spray to prevent bacterial blight.',
    descriptionKn: 'ಕೊಯ್ಲಿಗೆ ಬಂದಿದ್ದ ದಾಳಿಂಬೆ ಹಾಗೂ ದ್ರಾಕ್ಷಿ ತೋಟಗಳಿಗೆ ಆಲಿಕಲ್ಲು ಬಡಿದು ಅಪಾರ ನಷ್ಟ ಸಂಭವಿಸಿದೆ. ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಣೆಗೆ ಸಲಹೆ.',
    cropAffected: 'Pomegranate & Grapes (ದಾಳಿಂಬೆ / ದ್ರಾಕ್ಷಿ)',
    estimatedLoss: '12.5 Acres • Estimated Loss: ₹18,20,000',
    surveyNumber: 'Sy. No. 104/A',
    timestamp: '2026-10-02 04:10 PM',
    likesCount: 312,
    isLiked: false,
    sharesCount: 114,
    verifiedByGovt: true,
    reliefStatus: 'Compensation Processed',
    tags: ['#Vijayapura', '#Hailstorm', '#PomegranateLoss', '#Horticulture'],
  },
  {
    id: 'reel-kod-05',
    authorName: 'Karnataka SDRF Quick Response',
    authorRole: 'OFFICER',
    district: 'Kodagu',
    taluk: 'Madikeri',
    village: 'Bhagamandala / Talakaveri',
    disasterType: 'LANDSLIDE',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    title: 'ಭಾಗಮಂಡಲದಲ್ಲಿ ಭಾರಿ ಜಲಾವೃತ: ಕಾಫಿ ತೋಟಗಳಲ್ಲಿ ಮಣ್ಣಿನ ಸವೆತ',
    titleKn: 'ಭಾಗಮಂಡಲದಲ್ಲಿ ಭಾರಿ ಜಲಾವೃತ: ಕಾಫಿ ತೋಟಗಳಲ್ಲಿ ಮಣ್ಣಿನ ಸವೆತ',
    description: 'Cauvery river Triveni Sangama in spate. Hill slope coffee plantations experiencing soil slips. District administration deployed NDRF boats and temporary relief shelters.',
    descriptionKn: 'ಭಾಗಮಂಡಲ ತ್ರಿವೇಣಿ ಸಂಗಮ ಜಲಾವೃತಗೊಂಡಿದೆ. ಕಾಫಿ ಮತ್ತು ಕರಿಮೆಣಸು ಗಿಡಗಳ ರಕ್ಷಣೆಗೆ ಮಾರ್ಗಸೂಚಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ.',
    cropAffected: 'Coffee & Black Pepper (ಕಾಫಿ / ಕಾಳುಮೆಣಸು)',
    estimatedLoss: '15 Acres Hillside • Est Loss: ₹9,50,000',
    surveyNumber: 'Estate Block 3',
    timestamp: '2026-10-01 02:00 PM',
    likesCount: 420,
    isLiked: true,
    sharesCount: 160,
    verifiedByGovt: true,
    reliefStatus: 'Drainage Pumps Deployed',
    tags: ['#KodaguFloods', '#Madikeri', '#CoffeePlantation', '#SDRF'],
  },
  {
    id: 'reel-hav-06',
    authorName: 'Ningappa Kambar (Farmer)',
    authorRole: 'FARMER',
    district: 'Haveri',
    taluk: 'Byadagi',
    village: 'Mallur (Varada Basin)',
    disasterType: 'FLOOD_INUNDATION',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    title: 'ವರದಾ ನದಿ ಉಕ್ಕಿ ಬ್ಯಾಡಗಿ ಕೆಂಪು ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆಗೆ ಕೊಳೆ ರೋಗ',
    titleKn: 'ವರದಾ ನದಿ ಉಕ್ಕಿ ಬ್ಯಾಡಗಿ ಕೆಂಪು ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆಗೆ ಕೊಳೆ ರೋಗ',
    description: 'Varada river flood water entered 10 acres of famous Byadagi Chilli fields. Standing water for 48 hours has caused severe root rot (damping-off). Urgent fungicidal relief aid requested.',
    descriptionKn: 'ವರದಾ ನದಿ ನೀರು ನುಗ್ಗಿ ಬ್ಯಾಡಗಿ ಮೆಣಸಿನ ಗಿಡಗಳು ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿ ಕೊಳೆಯುತ್ತಿವೆ. ಪರಿಹಾರಕ್ಕೆ ಮನವಿ.',
    cropAffected: 'Byadagi Red Chilli (ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ)',
    estimatedLoss: '10.0 Acres • Estimated Loss: ₹6,20,000',
    surveyNumber: 'Sy. No. 71/2',
    timestamp: '2026-10-04 09:15 AM',
    likesCount: 185,
    isLiked: false,
    sharesCount: 54,
    verifiedByGovt: true,
    reliefStatus: 'SDRF Survey Underway',
    tags: ['#Haveri', '#ByadagiChilli', '#VaradaRiver', '#CropLoss'],
  },
  {
    id: 'reel-bag-07',
    authorName: 'Mahadevappa Patil',
    authorRole: 'FARMER',
    district: 'Bagalkot',
    taluk: 'Mudhol',
    village: 'Lokapur (Ghataprabha Backwater)',
    disasterType: 'FLOOD_INUNDATION',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80',
    title: 'ಘಟಪ್ರಭಾ ಹಿನ್ನೀರಿನಿಂದ 25 ಎಕರೆ ಮೆಕ್ಕೆಜೋಳ ಹೊಲ ಜಲಾವೃತ',
    titleKn: 'ಘಟಪ್ರಭಾ ಹಿನ್ನೀರಿನಿಂದ 25 ಎಕರೆ ಮೆಕ್ಕೆಜೋಳ ಹೊಲ ಜಲಾವೃತ',
    description: 'Backwaters inundating fertile alluvial fields in Mudhol taluk. 25 acres hybrid maize crop is fully inundated. Farmers seeking tractor-mounted high power sump pumps.',
    descriptionKn: 'ಮುಧೋಳ ತಾಲೂಕಿನ ಲೋಕಾಪುರದಲ್ಲಿ ನದಿ ಹಿನ್ನೀರು ನುಗ್ಗಿ ಮೆಕ್ಕೆಜೋಳ ಬೆಳೆ ಹಾಳಾಗಿದೆ.',
    cropAffected: 'Maize & Sorghum (ಮೆಕ್ಕೆಜೋಳ / ಜೋಳ)',
    estimatedLoss: '25 Acres • Estimated Loss: ₹8,90,000',
    surveyNumber: 'Sy. No. 132/A',
    timestamp: '2026-10-03 11:30 AM',
    likesCount: 220,
    isLiked: false,
    sharesCount: 42,
    verifiedByGovt: true,
    reliefStatus: 'Immediate Action Needed',
    tags: ['#Bagalkot', '#Mudhol', '#MaizeDamage', '#FloodAlert'],
  },
  {
    id: 'reel-kop-08',
    authorName: 'Tungabhadra Command Area Officer',
    authorRole: 'OFFICER',
    district: 'Koppal',
    taluk: 'Gangavathi',
    village: 'Karatagi',
    disasterType: 'CANAL_BREACH',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&auto=format&fit=crop&q=80',
    title: 'ತುಂಗಭದ್ರಾ ಎಡದಂಡೆ ನಾಲೆ ಒಡೆದು ಸೋನಾ ಮಸೂರಿ ಭತ್ತಕ್ಕೆ ಹಾನಿ',
    titleKn: 'ತುಂಗಭದ್ರಾ ಎಡದಂಡೆ ನಾಲೆ ಒಡೆದು ಸೋನಾ ಮಸೂರಿ ಭತ್ತಕ್ಕೆ ಹಾನಿ',
    description: 'TLBC canal embankment breach repaired on war footing by Irrigation Department. 30 Acres Sona Masoori paddy nurseries evaluated for PMFBY replanting subsidy.',
    descriptionKn: 'ನಾಲೆ ಒಡೆದ ಸ್ಥಳದಲ್ಲಿ ತುರ್ತು ದುರಸ್ತಿ ಕಾರ್ಯ ಪೂರ್ಣಗೊಂಡಿದೆ. ಭತ್ತದ ಸಸಿ ಮಡಿಗಳಿಗೆ ಉಂಟಾದ ನಷ್ಟದ ಪಟ್ಟಿ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ.',
    cropAffected: 'Sona Masoori Paddy (ಸೋನಾ ಮಸೂರಿ ಭತ್ತ)',
    estimatedLoss: '30.0 Acres • Estimated Loss: ₹11,50,000',
    surveyNumber: 'Sy. No. 55/1 to 55/6',
    timestamp: '2026-10-02 08:00 AM',
    likesCount: 375,
    isLiked: true,
    sharesCount: 130,
    verifiedByGovt: true,
    reliefStatus: 'Compensation Processed',
    tags: ['#Koppal', '#Gangavathi', '#PaddyLoss', '#TLBC'],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    adminName: 'Dr. Siddharamaiah M.',
    action: 'PUBLISH_DISASTER_ALERT',
    entityType: 'ALERT',
    entityId: 'alt-kal-01',
    timestamp: '2026-10-04 06:00:15',
    details: 'Dispatched Heavy Rainfall Warning to 3,420 registered farmers across Kalaburagi & Belagavi districts.',
  },
  {
    id: 'aud-2',
    adminName: 'Dr. Siddharamaiah M.',
    action: 'VERIFY_LOSS_REPORT',
    entityType: 'LOSS_REPORT',
    entityId: 'rep-2026-081',
    timestamp: '2026-08-25 14:20:00',
    details: 'Approved ₹18,500 input subsidy compensation for Veeresh Narooni (Sy. 142/2B).',
  },
];

// In-Memory & LocalStorage Service
export interface RegisteredFarmerEntry {
  id: string;
  name: string;
  mobile: string;
  password?: string;
  district: string;
  taluk: string;
  village: string;
  areaAcres: number;
  mainCrop: string;
  risk: string;
  status: 'VERIFIED' | 'PENDING';
  registeredAt: string;
}

export const INITIAL_REGISTERED_FARMERS: RegisteredFarmerEntry[] = [
  {
    id: 'FARMER-KA-001',
    name: 'Veeresh Narooni',
    mobile: '9845012345',
    password: 'farmer123',
    district: 'Kalaburagi',
    taluk: 'Kalaburagi',
    village: 'Sultanpur Village',
    areaAcres: 5.2,
    mainCrop: 'Tur (Pigeon Pea / ತೊಗರಿ)',
    risk: 'NORMAL (Live Weather)',
    status: 'VERIFIED',
    registeredAt: '2026-09-15T08:30:00Z',
  },
  {
    id: 'FARMER-KA-002',
    name: 'Mallappa Patil',
    mobile: '9448102233',
    password: 'farmer123',
    district: 'Kalaburagi',
    taluk: 'Aland',
    village: 'Madana Hipparga',
    areaAcres: 8.0,
    mainCrop: 'Bengal Gram & Cotton',
    risk: 'MODERATE (34/100)',
    status: 'VERIFIED',
    registeredAt: '2026-09-18T10:15:00Z',
  },
  {
    id: 'FARMER-KA-003',
    name: 'Basavaraj Hiremath',
    mobile: '9845229911',
    password: 'farmer123',
    district: 'Belagavi',
    taluk: 'Chikkodi',
    village: 'Examba',
    areaAcres: 4.5,
    mainCrop: 'Sugarcane (Co 86032)',
    risk: 'LOW (14/100)',
    status: 'VERIFIED',
    registeredAt: '2026-09-22T14:40:00Z',
  },
  {
    id: 'FARMER-KA-004',
    name: 'Shivanna Gowda',
    mobile: '9900334411',
    password: 'farmer123',
    district: 'Raichur',
    taluk: 'Sindhanur',
    village: 'Gorebal',
    areaAcres: 6.0,
    mainCrop: 'Paddy (Sona Masoori)',
    risk: 'LOW (18/100)',
    status: 'VERIFIED',
    registeredAt: '2026-09-28T09:00:00Z',
  },
];

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`kisanrakshak_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`kisanrakshak_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // Registered Farmers (Shared Statewide Directory)
  getRegisteredFarmers(): RegisteredFarmerEntry[] {
    return this.get<RegisteredFarmerEntry[]>('registered_farmers', INITIAL_REGISTERED_FARMERS);
  }
  saveRegisteredFarmer(farmer: RegisteredFarmerEntry): void {
    const list = this.getRegisteredFarmers();
    const idx = list.findIndex((f) => f.id === farmer.id || f.mobile === farmer.mobile);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...farmer };
    } else {
      list.unshift(farmer);
    }
    this.set('registered_farmers', list);
  }

  // Farms
  getFarms(): Farm[] {
    return this.get<Farm[]>('farms', [INITIAL_FARM]);
  }
  saveFarm(farm: Farm): void {
    const list = this.getFarms();
    const idx = list.findIndex((f) => f.id === farm.id);
    if (idx >= 0) list[idx] = farm;
    else list.push(farm);
    this.set('farms', list);
  }
  deleteFarm(id: string): void {
    const list = this.getFarms().filter((f) => f.id !== id);
    this.set('farms', list);
  }

  // Crops
  getCrops(): Crop[] {
    return this.get<Crop[]>('crops', INITIAL_CROPS);
  }
  saveCrop(crop: Crop): void {
    const list = this.getCrops();
    const idx = list.findIndex((c) => c.id === crop.id);
    if (idx >= 0) list[idx] = crop;
    else list.push(crop);
    this.set('crops', list);
  }
  deleteCrop(id: string): void {
    const list = this.getCrops().filter((c) => c.id !== id);
    this.set('crops', list);
  }

  // Seeds
  getSeeds(): SeedStock[] {
    return this.get<SeedStock[]>('seeds', INITIAL_SEEDS);
  }
  saveSeed(seed: SeedStock): void {
    const list = this.getSeeds();
    const idx = list.findIndex((s) => s.id === seed.id);
    if (idx >= 0) list[idx] = seed;
    else list.push(seed);
    this.set('seeds', list);
  }
  deleteSeed(id: string): void {
    const list = this.getSeeds().filter((s) => s.id !== id);
    this.set('seeds', list);
  }

  // Water
  getWater(): WaterResource[] {
    return this.get<WaterResource[]>('water', INITIAL_WATER);
  }
  saveWater(item: WaterResource): void {
    const list = this.getWater();
    const idx = list.findIndex((w) => w.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.set('water', list);
  }

  // Livestock
  getLivestock(): Livestock[] {
    return this.get<Livestock[]>('livestock', INITIAL_LIVESTOCK);
  }
  saveLivestock(item: Livestock): void {
    const list = this.getLivestock();
    const idx = list.findIndex((l) => l.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.set('livestock', list);
  }

  // Assets
  getAssets(): FarmAsset[] {
    return this.get<FarmAsset[]>('assets', INITIAL_ASSETS);
  }
  saveAsset(item: FarmAsset): void {
    const list = this.getAssets();
    const idx = list.findIndex((a) => a.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.set('assets', list);
  }

  // Storage
  getStorage(): StorageUnit[] {
    return this.get<StorageUnit[]>('storage', INITIAL_STORAGE);
  }
  saveStorage(item: StorageUnit): void {
    const list = this.getStorage();
    const idx = list.findIndex((s) => s.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.set('storage', list);
  }

  // Documents
  getDocuments(): DocumentRecord[] {
    return this.get<DocumentRecord[]>('documents', INITIAL_DOCS);
  }
  saveDocument(doc: DocumentRecord): void {
    const list = this.getDocuments();
    list.unshift(doc);
    this.set('documents', list);
  }
  deleteDocument(id: string): void {
    const list = this.getDocuments().filter((d) => d.id !== id);
    this.set('documents', list);
  }

  // Protection Steps
  getProtectionSteps(): ProtectionStep[] {
    return this.get<ProtectionStep[]>('protection_steps', INITIAL_PROTECTION_STEPS);
  }
  saveProtectionSteps(steps: ProtectionStep[]): void {
    this.set('protection_steps', steps);
  }

  // Alerts
  getAlerts(): DisasterAlert[] {
    return this.get<DisasterAlert[]>('alerts', INITIAL_ALERTS);
  }
  saveAlert(alert: DisasterAlert): void {
    const list = this.getAlerts();
    const idx = list.findIndex((a) => a.id === alert.id);
    if (idx >= 0) list[idx] = alert;
    else list.unshift(alert);
    this.set('alerts', list);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kisan_alerts_updated'));
    }
  }
  deleteAlert(id: string): void {
    const list = this.getAlerts().filter((a) => a.id !== id);
    this.set('alerts', list);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kisan_alerts_updated'));
    }
  }

  // Loss Reports
  getLossReports(): LossReport[] {
    return this.get<LossReport[]>('loss_reports', INITIAL_LOSS_REPORTS);
  }
  saveLossReport(report: LossReport): void {
    const list = this.getLossReports();
    const idx = list.findIndex((r) => r.id === report.id);
    if (idx >= 0) list[idx] = report;
    else list.unshift(report);
    this.set('loss_reports', list);
  }

  // Recovery Tasks
  getRecoveryTasks(): RecoveryTask[] {
    return this.get<RecoveryTask[]>('recovery_tasks', INITIAL_RECOVERY_TASKS);
  }
  saveRecoveryTasks(tasks: RecoveryTask[]): void {
    this.set('recovery_tasks', tasks);
  }

  // Schemes
  getSchemes(): GovernmentScheme[] {
    return this.get<GovernmentScheme[]>('schemes', INITIAL_SCHEMES);
  }
  saveScheme(scheme: GovernmentScheme): void {
    const list = this.getSchemes();
    const idx = list.findIndex((s) => s.id === scheme.id);
    if (idx >= 0) list[idx] = scheme;
    else list.unshift(scheme);
    this.set('schemes', list);
  }

  // Assistance Requests
  getAssistanceRequests(): AssistanceRequest[] {
    return this.get<AssistanceRequest[]>('assistance', INITIAL_ASSISTANCE);
  }
  saveAssistanceRequest(req: AssistanceRequest): void {
    const list = this.getAssistanceRequests();
    const idx = list.findIndex((a) => a.id === req.id);
    if (idx >= 0) list[idx] = req;
    else list.unshift(req);
    this.set('assistance', list);
  }

  private memoryReels: DisasterReel[] | null = null;

  // Disaster Reels (Ground Reports)
  getDisasterReels(): DisasterReel[] {
    if (this.memoryReels && this.memoryReels.length > 0) {
      return this.memoryReels;
    }
    const stored = this.get<DisasterReel[]>('disaster_reels', INITIAL_DISASTER_REELS);
    // If stored contains old mixkit URLs, refresh them with INITIAL_DISASTER_REELS
    if (stored.some((r) => r.mediaUrl.includes('mixkit.co'))) {
      this.set('disaster_reels', INITIAL_DISASTER_REELS);
      this.memoryReels = [...INITIAL_DISASTER_REELS];
      return INITIAL_DISASTER_REELS;
    }
    this.memoryReels = stored;
    return stored;
  }
  saveDisasterReel(reel: DisasterReel): void {
    const list = [...this.getDisasterReels()];
    const idx = list.findIndex((r) => r.id === reel.id);
    if (idx >= 0) list[idx] = reel;
    else list.unshift(reel);
    this.memoryReels = list;
    this.set('disaster_reels', list);
  }
  toggleLikeReel(id: string): { isLiked: boolean; count: number } {
    const list = [...this.getDisasterReels()];
    const reel = list.find((r) => r.id === id);
    if (!reel) return { isLiked: false, count: 0 };
    reel.isLiked = !reel.isLiked;
    reel.likesCount = (reel.likesCount || 0) + (reel.isLiked ? 1 : -1);
    this.memoryReels = list;
    this.set('disaster_reels', list);
    return { isLiked: reel.isLiked, count: reel.likesCount };
  }
  deleteDisasterReel(id: string): void {
    const list = this.getDisasterReels().filter((r) => r.id !== id);
    this.memoryReels = list;
    this.set('disaster_reels', list);
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.get<AuditLog[]>('audit_logs', INITIAL_AUDIT_LOGS);
  }
  addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const list = this.getAuditLogs();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    list.unshift({
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: now,
    });
    this.set('audit_logs', list.slice(0, 50));
  }
}

export const db = new StorageService();

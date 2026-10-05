export type Role = 'ROLE_FARMER' | 'ROLE_ADMIN';

export type Language = 'en' | 'kn';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: Role;
  district: string;
  taluk: string;
  village: string;
  avatar?: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  district: string;
  taluk: string;
  village: string;
  farmCount: number;
  totalAcreage: number;
  mainCrops: string[];
  kisanId: string;
  aadhaarLinked: boolean;
  emergencyContact: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  areaAcres: number;
  soilType: 'Black Soil' | 'Red Sandy Loam' | 'Clayey' | 'Alluvial' | 'Laterite';
  irrigationType: 'Borewell' | 'Canal' | 'Rainfed' | 'Drip Irrigation' | 'Tank';
  waterSource: string;
  latitude: number;
  longitude: number;
  riskScore: number; // 0 - 100
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
}

export interface Crop {
  id: string;
  farmId: string;
  name: string; // e.g. Tur (Pigeon Pea), Ragi, Jowar, Cotton, Sugarcane
  kannadaName?: string;
  variety: string;
  areaAcres: number;
  sowingDate: string;
  expectedHarvestDate: string;
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Pod Formation' | 'Maturity / Ready to Harvest';
  irrigationMethod: string;
  condition: 'Excellent' | 'Good' | 'Moderate' | 'At Risk';
  vulnerabilityTo: string[]; // e.g. ["Waterlogging", "Drought", "Pest outbreak"]
}

export interface SeedStock {
  id: string;
  farmId: string;
  seedType: string;
  crop: string;
  quantityKg: number;
  season: 'Kharif' | 'Rabi' | 'Summer';
  storageLocation: string; // e.g. 'Farm Store Room (Elevated Platform)'
  storageCondition: 'Safe & Dry' | 'Needs Check' | 'Exposed';
  lastCheckedDate: string;
  checklist: {
    dryStorage: boolean;
    elevatedPlatform: boolean;
    waterproofCover: boolean;
    rodentProof: boolean;
    wellVentilated: boolean;
  };
}

export interface WaterResource {
  id: string;
  farmId: string;
  sourceType: 'Borewell' | 'Open Well' | 'Farm Pond (Krishi Honda)' | 'Canal' | 'Rainwater Storage Tank';
  sourceName: string;
  capacityLiters: number;
  currentAvailabilityPercent: number; // 0 - 100
  irrigatedAreaAcres: number;
  depthFeet?: number;
  lastCheckedDate: string;
  status: 'Abundant' | 'Adequate' | 'Critical Low' | 'Dry';
  rechargeStructureWorking: boolean;
}

export interface Livestock {
  id: string;
  farmId: string;
  animalType: 'Cattle (Cow/Ox)' | 'Buffalo' | 'Goat' | 'Sheep' | 'Poultry' | 'Other';
  breed: string;
  count: number;
  shelterType: 'Pukka Shed' | 'Thatched Roof' | 'Open Enclosure';
  feedStockDays: number;
  waterAvailabilityLitersDaily: number;
  safetyStatus: 'SAFE' | 'AT RISK' | 'EVACUATED';
  vaccinated: boolean;
}

export interface FarmAsset {
  id: string;
  farmId: string;
  name: string;
  category: 'Tractor' | 'Submersible Pump' | 'Sprayer Equipment' | 'Solar Panel / Pump' | 'Harvester' | 'Fertilizer Stock' | 'Tool Set';
  quantity: number;
  storageLocation: string;
  estimatedValueInr?: number;
  protectionStatus: 'SAFE' | 'AT RISK' | 'PROTECTED';
  securedAgainstFlood: boolean;
}

export interface StorageUnit {
  id: string;
  farmId: string;
  unitName: string;
  type: 'Seed Storage' | 'Fertilizer Godown' | 'Harvested Grain Store' | 'Implement Shed';
  elevationAboveGroundCm: number;
  isWaterproofRoof: boolean;
  isPestProtected: boolean;
  isVentilated: boolean;
  readinessPercentage: number;
}

export interface DocumentRecord {
  id: string;
  userId: string;
  title: string;
  docType: 'RTC / Pahani (Land Record)' | 'Crop Insurance (PMFBY)' | 'Kisan Credit Card (KCC)' | 'Aadhaar Card' | 'Bank Passbook' | 'Soil Health Card';
  fileName: string;
  uploadDate: string;
  verificationStatus: 'VERIFIED' | 'UNDER_REVIEW' | 'PENDING';
  fileSizeKb: number;
}

export interface WeatherData {
  district: string;
  taluk: string;
  village: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feelsLike: number;
  weatherCondition: string;
  weatherCode: number;
  humidity: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  rainProbability: number;
  rainfallMmNext24h: number;
  lastUpdated: string;
  isLive: boolean;
  hourly: {
    time: string;
    temperature: number;
    rainProbability: number;
    condition: string;
  }[];
  forecast: {
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    rainProbability: number;
    rainfallMm: number;
    condition: string;
    riskSummary: string;
  }[];
}

export interface FarmRiskScore {
  overallScore: number; // 0 - 100
  overallCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  explanation: string;
  breakdown: {
    floodRisk: number; // 0 - 100
    droughtRisk: number;
    heatStressRisk: number;
    windDamageRisk: number;
    pestRisk: number;
  };
}

export interface PriorityAction {
  id: string;
  title: string;
  titleKn?: string;
  description: string;
  urgency: 'HIGH' | 'MEDIUM' | 'NORMAL';
  category: 'CROP' | 'SEED' | 'WATER' | 'LIVESTOCK' | 'ASSET' | 'STORAGE' | 'DRAINAGE';
  completed: boolean;
  dueDate: string;
  impactIfIgnored: string;
}

export interface ProtectionStep {
  stepNumber: number;
  code: string;
  title: string;
  titleKn?: string;
  description: string;
  iconName: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercentage: number;
  checklist: {
    id: string;
    text: string;
    completed: boolean;
    importance: 'Essential' | 'Recommended';
  }[];
}

export interface DisasterAlert {
  id: string;
  title: string;
  titleKn?: string;
  disasterType: 'HEAVY_RAIN' | 'FLOOD' | 'DROUGHT' | 'HEATWAVE' | 'HAILSTORM' | 'CYCLONIC_WINDS' | 'PEST_SWARM';
  severity: 'WATCH' | 'WARNING' | 'EMERGENCY';
  districts: string[];
  taluks: string[];
  issuedAt: string;
  validUntil: string;
  description: string;
  farmImpact: string;
  affectedResources: string[];
  recommendedActions: string[];
  createdBy: string;
  isActive: boolean;
}

export interface LossReport {
  id: string;
  farmerId: string;
  farmerName: string;
  mobile: string;
  district: string;
  taluk: string;
  village: string;
  farmName: string;
  disasterType: string;
  affectedResource: 'Crops' | 'Seed Stock' | 'Livestock' | 'Farm Machinery' | 'Storage / Godown' | 'Borewell / Water Infrastructure';
  resourceDetails: string;
  damageDescription: string;
  estimatedLossInr: number;
  affectedAcreageOrUnits: string;
  photosUploaded: string[];
  reportedAt: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'SUPPORT_PROCESSING' | 'COMPLETED';
  officialRemarks?: string;
  compensationSanctionedInr?: number;
}

export interface RecoveryTask {
  id: string;
  farmerId: string;
  phase: 'Immediate (0-7 Days)' | 'Rebuilding (1-4 Weeks)' | 'Long Term Restructure';
  taskTitle: string;
  category: 'Replanting' | 'Soil Remediation' | 'Livestock Care' | 'Irrigation Repair' | 'Subsidy Application';
  isCompleted: boolean;
  guidance: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  nameKn: string;
  department: string;
  purpose: string;
  eligibilityCriteria: string[];
  benefits: string;
  requiredDocuments: string[];
  officialPortalUrl: string;
  helpline: string;
  isActive: boolean;
}

export interface AssistanceRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  mobile: string;
  district: string;
  taluk: string;
  village?: string;
  problem: string;
  disasterCategory: string;
  priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'NORMAL';
  requiredHelp: 'Livestock Fodder' | 'Drainage Pump' | 'Emergency Seeds' | 'Drinking Water Supply' | 'Field Assessment';
  assignedOfficer?: string;
  status: 'OPEN' | 'ASSIGNED' | 'DISPATCHED' | 'RESOLVED';
  createdAt: string;
}

export interface DisasterReel {
  id: string;
  authorName: string;
  authorRole: 'FARMER' | 'OFFICER' | 'KRISHI_VIGYAN_KENDRA' | 'VOLUNTEER';
  authorAvatar?: string;
  district: string;
  taluk: string;
  village: string;
  disasterType: 'FLOOD_INUNDATION' | 'CLOUDBURST_RAIN' | 'HAILSTORM_DAMAGE' | 'DROUGHT_WITHERING' | 'LANDSLIDE' | 'CANAL_BREACH' | 'LIGHTNING_LIVESTOCK';
  mediaType: 'video' | 'image';
  mediaUrl: string;
  thumbnailUrl?: string;
  title: string;
  titleKn?: string;
  description: string;
  descriptionKn?: string;
  cropAffected: string;
  estimatedLoss: string;
  surveyNumber?: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
  sharesCount: number;
  verifiedByGovt: boolean;
  reliefStatus: 'SDRF Survey Underway' | 'Immediate Action Needed' | 'Drainage Pumps Deployed' | 'Compensation Processed' | 'Alert Broadcasted';
  tags: string[];
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  entityType: 'ALERT' | 'FARMER' | 'LOSS_REPORT' | 'SCHEME' | 'ASSISTANCE' | 'DISASTER_REEL';
  entityId: string;
  timestamp: string;
  details: string;
}

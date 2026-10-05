import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, FarmerProfile, Role } from '../types';
import { DEMO_USERS, db, RegisteredFarmerEntry } from '../services/mockBackendApi';

export interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  currentUser: User | null;
  farmerProfile: FarmerProfile;
  role: Role | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isFarmer: boolean;
  login: (identifier: string, pass: string, role: Role) => LoginResult;
  registerFarmer: (data: Partial<FarmerProfile> & { password?: string }) => void;
  logout: () => void;
  switchUser: (role: Role) => void;
  updateLocation: (district: string, taluk: string, village?: string) => void;
}

const DEFAULT_PROFILE: FarmerProfile = {
  id: 'prof-1',
  userId: 'usr-farmer-1',
  name: 'Veeresh Narooni',
  mobile: '9845012345',
  district: 'Kalaburagi',
  taluk: 'Kalaburagi',
  village: 'Sultanpur Village',
  farmCount: 1,
  totalAcreage: 5.2,
  mainCrops: ['Tur (Pigeon Pea)', 'Jowar (Sorghum)'],
  kisanId: 'KA-KLB-2024-8849',
  aadhaarLinked: true,
  emergencyContact: '9448123999',
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  farmerProfile: DEFAULT_PROFILE,
  role: null,
  isAuthenticated: false,
  isAdmin: false,
  isFarmer: false,
  login: () => ({ success: false }),
  registerFarmer: () => {},
  logout: () => {},
  switchUser: () => {},
  updateLocation: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kisanrakshak_user');
    return saved ? JSON.parse(saved) : null; // Start logged out if no saved session
  });

  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(() => {
    const saved = localStorage.getItem('kisanrakshak_farmer_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const login = (identifier: string, pass: string, targetRole: Role): LoginResult => {
    const cleanId = identifier.trim();
    const cleanPass = pass.trim();

    if (!cleanId) {
      return { success: false, error: 'Please enter your Mobile Number or User ID.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please enter your Password.' };
    }

    if (targetRole === 'ROLE_ADMIN') {
      const validAdminIds = ['admin', '9448099887', 'admin.agriculture@karnataka.gov.in', 'admin@karnataka.gov.in', 'dr.siddharamaiah'];
      const isValidAdminId = validAdminIds.some((id) => id.toLowerCase() === cleanId.toLowerCase());
      const isValidAdminPass = cleanPass === 'admin123' || cleanPass === 'admin';

      if (!isValidAdminId || !isValidAdminPass) {
        return {
          success: false,
          error: '❌ Invalid Admin ID or Password. Only authorized Karnataka Disaster Officers can log in here (Demo ID: admin / pass: admin123).',
        };
      }

      const admin = DEMO_USERS.find((u) => u.role === 'ROLE_ADMIN') || DEMO_USERS[1];
      setCurrentUser(admin);
      localStorage.setItem('kisanrakshak_user', JSON.stringify(admin));
      return { success: true };
    }

    // Farmer Login: STRICT VALIDATION AGAINST REGISTERED FARMERS DATABASE
    const allRegisteredFarmers = db.getRegisteredFarmers();
    const matchedFarmer = allRegisteredFarmers.find(
      (f) => f.mobile === cleanId || f.id.toLowerCase() === cleanId.toLowerCase()
    );

    if (!matchedFarmer) {
      return {
        success: false,
        error: `❌ Mobile number "${cleanId}" is not registered. Please check the number or click "Register" to create a new farmer account.`,
      };
    }

    const expectedPassword = matchedFarmer.password || 'farmer123';
    if (cleanPass !== expectedPassword && cleanPass !== 'farmer123') {
      return {
        success: false,
        error: '❌ Incorrect password. Please enter the password you registered with (or default: farmer123).',
      };
    }

    // Successful Farmer Login
    const matchedUser: User = {
      id: matchedFarmer.id,
      name: matchedFarmer.name,
      mobile: matchedFarmer.mobile,
      role: 'ROLE_FARMER',
      district: matchedFarmer.district,
      taluk: matchedFarmer.taluk,
      village: matchedFarmer.village,
    };

    const matchedProfile: FarmerProfile = {
      ...DEFAULT_PROFILE,
      id: `prof-${matchedFarmer.id}`,
      userId: matchedFarmer.id,
      name: matchedFarmer.name,
      mobile: matchedFarmer.mobile,
      district: matchedFarmer.district,
      taluk: matchedFarmer.taluk,
      village: matchedFarmer.village,
      totalAcreage: matchedFarmer.areaAcres,
      mainCrops: [matchedFarmer.mainCrop],
      kisanId: `KA-${matchedFarmer.district.substring(0, 3).toUpperCase()}-${matchedFarmer.id.slice(-4)}`,
    };

    setCurrentUser(matchedUser);
    setFarmerProfile(matchedProfile);
    localStorage.setItem('kisanrakshak_user', JSON.stringify(matchedUser));
    localStorage.setItem('kisanrakshak_farmer_profile', JSON.stringify(matchedProfile));
    localStorage.setItem('kisanrakshak_active_farmer', JSON.stringify(matchedUser));

    return { success: true };
  };

  const registerFarmer = (data: Partial<FarmerProfile> & { password?: string }) => {
    const customId = `FARMER-KA-${Date.now().toString().slice(-4)}`;
    const userPass = data.password && data.password.trim() ? data.password.trim() : 'farmer123';

    const newUser: User = {
      id: `usr-farmer-${Date.now()}`,
      name: data.name || 'Karnataka Farmer',
      mobile: data.mobile || '9900011223',
      role: 'ROLE_FARMER',
      district: data.district || 'Kalaburagi',
      taluk: data.taluk || 'Kalaburagi',
      village: data.village || 'Gram Panchayat',
    };

    const newProfile: FarmerProfile = {
      ...DEFAULT_PROFILE,
      id: `prof-${Date.now()}`,
      userId: newUser.id,
      name: newUser.name,
      mobile: newUser.mobile,
      district: newUser.district,
      taluk: newUser.taluk,
      village: newUser.village,
      totalAcreage: data.totalAcreage || 4.5,
      mainCrops: data.mainCrops || ['Tur (Pigeon Pea)'],
      kisanId: `KA-${(data.district || 'KA').substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
    };

    // 1. Save to registered farmers list with password so Admin Portal displays this new farmer immediately!
    const farmerEntry: RegisteredFarmerEntry = {
      id: customId,
      name: newUser.name,
      mobile: newUser.mobile,
      password: userPass,
      district: newUser.district,
      taluk: newUser.taluk,
      village: newUser.village,
      areaAcres: data.totalAcreage || 4.5,
      mainCrop: data.mainCrops?.[0] || 'Tur (Pigeon Pea)',
      risk: 'NORMAL (Live Weather)',
      status: 'VERIFIED',
      registeredAt: new Date().toISOString(),
    };
    db.saveRegisteredFarmer(farmerEntry);

    // 2. Create the farmer's initial farm record in db
    db.saveFarm({
      id: `farm-${Date.now()}`,
      userId: newUser.id,
      name: `${newUser.name}'s Farm`,
      district: newUser.district,
      taluk: newUser.taluk,
      village: newUser.village,
      surveyNumber: `Sy. No. ${Math.floor(Math.random() * 150 + 10)}/1`,
      areaAcres: data.totalAcreage || 4.5,
      soilType: 'Black Soil',
      irrigationType: 'Borewell',
      waterSource: 'Borewell + Krishi Honda',
      latitude: 17.3297,
      longitude: 76.8343,
      riskScore: 18,
      riskCategory: 'LOW',
    });

    // 3. Create initial crop
    db.saveCrop({
      id: `crop-${Date.now()}`,
      farmId: `farm-${Date.now()}`,
      name: data.mainCrops?.[0] || 'Tur (Pigeon Pea)',
      kannadaName: 'ತೊಗರಿ',
      variety: 'Certified Standard',
      areaAcres: data.totalAcreage || 4.5,
      sowingDate: '2026-07-01',
      expectedHarvestDate: '2026-11-20',
      growthStage: 'Vegetative',
      irrigationMethod: 'Drip & Rainfed',
      condition: 'Good',
      vulnerabilityTo: ['Excess Waterlogging'],
    });

    // 4. Log in system audit log for Admin visibility
    db.addAuditLog({
      adminName: 'Citizen Registration Portal',
      action: 'FARMER_REGISTERED',
      entityType: 'FARMER',
      entityId: customId,
      details: `New farmer ${newUser.name} (Mobile: ${newUser.mobile}) registered from ${newUser.village}, ${newUser.taluk} (${newUser.district}). Land: ${newProfile.totalAcreage} Acres. Main Crop: ${farmerEntry.mainCrop}.`,
    });

    setCurrentUser(newUser);
    setFarmerProfile(newProfile);
    localStorage.setItem('kisanrakshak_user', JSON.stringify(newUser));
    localStorage.setItem('kisanrakshak_farmer_profile', JSON.stringify(newProfile));
    localStorage.setItem('kisanrakshak_active_farmer', JSON.stringify(newUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kisanrakshak_user');
  };

  const switchUser = (targetRole: Role) => {
    // Only allow switching to Farmer if previously authenticated
    if (targetRole === 'ROLE_FARMER') {
      const savedActiveFarmer = localStorage.getItem('kisanrakshak_active_farmer');
      if (savedActiveFarmer) {
        const parsed = JSON.parse(savedActiveFarmer);
        setCurrentUser(parsed);
        localStorage.setItem('kisanrakshak_user', JSON.stringify(parsed));
      }
    }
  };

  const updateLocation = (district: string, taluk: string, village?: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, district, taluk, village: village || currentUser.village };
      setCurrentUser(updatedUser);
      localStorage.setItem('kisanrakshak_user', JSON.stringify(updatedUser));
    }
    const updatedProf = { ...farmerProfile, district, taluk, village: village || farmerProfile.village };
    setFarmerProfile(updatedProf);
    localStorage.setItem('kisanrakshak_farmer_profile', JSON.stringify(updatedProf));
  };

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';
  const isFarmer = currentUser?.role === 'ROLE_FARMER';
  const role = currentUser?.role || null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        farmerProfile,
        role,
        isAuthenticated,
        isAdmin,
        isFarmer,
        login,
        registerFarmer,
        logout,
        switchUser,
        updateLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

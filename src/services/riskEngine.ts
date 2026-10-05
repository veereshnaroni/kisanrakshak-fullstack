import { WeatherData, Farm, Crop, FarmRiskScore, PriorityAction } from '../types';

export function calculateFarmRisk(
  weather: WeatherData,
  farm?: Farm,
  crops: Crop[] = []
): FarmRiskScore {
  const rainMm = weather.rainfallMmNext24h ?? 0;
  const rainProb = weather.rainProbability ?? 0;
  const temp = weather.temperature ?? 30;
  const wind = weather.windSpeedKmh ?? 10;
  const humidity = weather.humidity ?? 50;

  // 1. Flood & Waterlogging Risk: strictly derived from precipitation
  let floodRisk = 0;
  if (rainMm === 0) {
    floodRisk = Math.min(8, Math.round(rainProb * 0.08)); // Max 8% if rain is 0
  } else if (rainMm < 15) {
    floodRisk = Math.round(10 + rainMm * 1.5); // 10% - 32%
  } else if (rainMm < 40) {
    floodRisk = Math.round(35 + (rainMm - 15) * 1.6); // 35% - 75%
  } else {
    floodRisk = Math.min(100, Math.round(75 + (rainMm - 40) * 0.6));
  }

  // Black soil moisture retention factor ONLY if it is actually raining
  if (farm?.soilType === 'Black Soil' && rainMm > 15) {
    floodRisk = Math.min(100, floodRisk + 10);
  }

  // 2. Heat Stress Risk: strictly derived from temperature
  let heatRisk = 5;
  if (temp <= 28) {
    heatRisk = 5;
  } else if (temp <= 33) {
    heatRisk = Math.round(5 + (temp - 28) * 4); // 5% - 25%
  } else if (temp <= 37) {
    heatRisk = Math.round(25 + (temp - 33) * 10); // 25% - 65%
  } else {
    heatRisk = Math.min(100, Math.round(65 + (temp - 37) * 12)); // >37C: 65% - 100%
  }

  // 3. Wind & Lodging Risk: strictly derived from wind speed
  let windRisk = 5;
  if (wind <= 12) {
    windRisk = 5;
  } else if (wind <= 25) {
    windRisk = Math.round(5 + (wind - 12) * 2.5); // 5% - 37%
  } else if (wind <= 40) {
    windRisk = Math.round(38 + (wind - 25) * 3); // 38% - 83%
  } else {
    windRisk = Math.min(100, Math.round(83 + (wind - 40) * 2));
  }

  // 4. Drought & Soil Moisture Deficit Risk: strictly derived from dry duration and heat
  let droughtRisk = 5;
  if (rainMm > 15) {
    droughtRisk = 5;
  } else if (rainMm > 2) {
    droughtRisk = 12;
  } else {
    // 0 mm rain: drought stress depends on temperature and low humidity
    const heatContribution = Math.max(0, temp - 27) * 2.5;
    const drynessContribution = Math.max(0, (60 - humidity) * 0.5);
    droughtRisk = Math.min(85, Math.round(12 + heatContribution + drynessContribution));
  }

  // 5. Pest & Disease Risk: high in warm, humid weather
  let pestRisk = 12;
  if (humidity > 70 && temp > 25) {
    pestRisk = Math.min(75, Math.round(25 + (humidity - 70) * 1.8));
  } else if (rainMm > 30) {
    pestRisk = 40;
  }

  // Crop vulnerability factor (e.g. flowering crops under high moisture or extreme heat)
  const isFlowering = crops.some((c) => c.growthStage === 'Flowering' || c.growthStage === 'Pod Formation');
  if (isFlowering && rainMm > 35) {
    floodRisk = Math.min(100, floodRisk + 8);
  }
  if (isFlowering && temp > 36) {
    heatRisk = Math.min(100, heatRisk + 10);
  }

  // Clamp all
  floodRisk = Math.min(100, Math.max(0, floodRisk));
  droughtRisk = Math.min(100, Math.max(0, droughtRisk));
  heatRisk = Math.min(100, Math.max(0, heatRisk));
  windRisk = Math.min(100, Math.max(0, windRisk));
  pestRisk = Math.min(100, Math.max(0, pestRisk));

  // Overall Composite Score (weighted toward the highest active hazard)
  const dominantHazard = Math.max(floodRisk, droughtRisk, heatRisk, windRisk);
  const averageHazards = (floodRisk + droughtRisk + heatRisk + windRisk + pestRisk) / 5;
  const overall = Math.round(dominantHazard * 0.65 + averageHazards * 0.35);

  let category: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' = 'LOW';
  if (overall >= 70) category = 'SEVERE';
  else if (overall >= 50) category = 'HIGH';
  else if (overall >= 28) category = 'MODERATE';

  // Dynamic explanation matching real meteorological data
  let explanation = '';
  if (rainMm >= 40) {
    explanation = `High rainfall of ${rainMm}mm expected in ${weather.taluk}. Waterlogging risk elevated (${floodRisk}%). Clear bund drainage immediately.`;
  } else if (temp >= 36) {
    explanation = `High ambient temperature of ${temp}°C detected in ${weather.taluk}. Heat stress risk elevated (${heatRisk}%). Protect standing crops and livestock.`;
  } else if (wind >= 30) {
    explanation = `Squall wind speeds of ${wind} km/h detected in ${weather.taluk}. Watch for crop lodging in tall stalks (${windRisk}%).`;
  } else if (droughtRisk >= 50) {
    explanation = `Dry conditions with 0mm precipitation and low humidity (${humidity}%) in ${weather.taluk}. Soil moisture deficit index at ${droughtRisk}%.`;
  } else {
    explanation = `Favorable weather conditions in ${weather.taluk}: ${temp}°C, ${rainMm}mm rainfall, wind ${wind} km/h. Routine farm operations safe.`;
  }

  return {
    overallScore: overall,
    overallCategory: category,
    explanation,
    breakdown: {
      floodRisk,
      droughtRisk,
      heatStressRisk: heatRisk,
      windDamageRisk: windRisk,
      pestRisk,
    },
  };
}

export function generatePriorityActions(
  weather: WeatherData,
  riskScore: FarmRiskScore,
  crops: Crop[] = []
): PriorityAction[] {
  const actions: PriorityAction[] = [];

  if (weather.rainfallMmNext24h >= 40 || weather.rainProbability >= 65) {
    actions.push({
      id: 'act-drainage',
      title: 'Clear field drainage channels',
      titleKn: 'ಹೊಲದ ನೀರುಗಾಲುವೆಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ',
      description: 'Dig shallow trenches around Tur and standing crops to evacuate standing rainwater within 12 hours.',
      urgency: 'HIGH',
      category: 'DRAINAGE',
      completed: false,
      dueDate: 'Before sunset today',
      impactIfIgnored: 'Prevents root asphyxiation, collar rot, and crop lodging in heavy rainfall.',
    });

    actions.push({
      id: 'act-seed-elevate',
      title: 'Move seed bags onto raised wooden pallets',
      titleKn: 'ಬೀಜದ ಚೀಲಗಳನ್ನು ಎತ್ತರದ ಮರದ ಹಲಗೆಗಳ ಮೇಲೆ ಇರಿಸಿ',
      description: 'Ensure 80 kg Tur seed bags in storage are kept at least 30 cm above ground level with tarpaulin coverage.',
      urgency: 'HIGH',
      category: 'SEED',
      completed: true,
      dueDate: 'Immediate',
      impactIfIgnored: 'Moisture ingress causes fungal rotting and zero germination rate.',
    });

    actions.push({
      id: 'act-livestock-shed',
      title: 'Inspect cattle shed roof and secure animal tethering',
      titleKn: 'ದನದ ಕೊಟ್ಟಿಗೆಯ ಛಾವಣಿಯನ್ನು ಪರಿಶೀಲಿಸಿ',
      description: 'Ensure animal shed floor is dry, elevated, and cattle are tethered loosely with quick-release knots in case of surge.',
      urgency: 'MEDIUM',
      category: 'LIVESTOCK',
      completed: false,
      dueDate: 'Tonight',
      impactIfIgnored: 'Prevents hoof infections, hypothermia, and panic injuries in thunder.',
    });

    actions.push({
      id: 'act-equipment-pumps',
      title: 'Elevate electric submersible pump starter & motor',
      titleKn: 'ವಿದ್ಯುತ್ ಪಂಪ್ ಮೋಟಾರ್ ಸುರಕ್ಷಿತವಾಗಿಡಿ',
      description: 'Disconnect open electrical switches near the borewell and secure movable tools in a locked implement shed.',
      urgency: 'MEDIUM',
      category: 'ASSET',
      completed: true,
      dueDate: 'Within 6 hours',
      impactIfIgnored: 'Avoids motor burnout and electrical short-circuits from water flash.',
    });
  } else if (weather.temperature >= 36) {
    actions.push({
      id: 'act-heat-irrigation',
      title: 'Apply light evening or early morning irrigation',
      titleKn: 'ಸಂಜೆ ಅಥವಾ ಮುಂಜಾನೆ ಲಘು ನೀರಾವರಿ ನೀಡಿ',
      description: 'Irrigate during cool hours to mitigate plant heat shock and reduce soil moisture evaporation.',
      urgency: 'HIGH',
      category: 'CROP',
      completed: false,
      dueDate: 'Early evening',
      impactIfIgnored: 'Flower drop and stunted vegetative growth under severe heat.',
    });

    actions.push({
      id: 'act-livestock-water',
      title: 'Provide shade and cool drinking water for cattle',
      titleKn: 'ಜಾನುವಾರುಗಳಿಗೆ ನೆರಳು ಮತ್ತು ಕುಡಿಯುವ ನೀರನ್ನು ಒದಗಿಸಿ',
      description: 'Keep water troughs under thatched shade and add electrolytes or mineral mixture.',
      urgency: 'HIGH',
      category: 'LIVESTOCK',
      completed: true,
      dueDate: 'Immediate',
      impactIfIgnored: 'Heat exhaustion, drop in milk yield, and respiratory distress.',
    });
  } else {
    // Moderate / dry days
    actions.push({
      id: 'act-water-check',
      title: 'Audit borewell output and farm pond water level',
      titleKn: 'ಬೋರ್‌ವೆಲ್ ಮತ್ತು ಕೃಷಿ ಹೊಂಡದ ನೀರಿನ ಮಟ್ಟ ತಪಾಸಣೆ',
      description: 'Record recharge status and verify drip lateral lines for blockages.',
      urgency: 'NORMAL',
      category: 'WATER',
      completed: true,
      dueDate: 'This week',
      impactIfIgnored: 'Allows early warning if regional water table drops abruptly.',
    });

    actions.push({
      id: 'act-pest-scouting',
      title: 'Scout Tur crop for pod borer and wilt symptoms',
      titleKn: 'ತೊಗರಿ ಬೆಳೆಯಲ್ಲಿ ಕೀಟ ಬಾಧೆ ಪರಿಶೀಲಿಸಿ',
      description: 'Install pheromone traps (5 per acre) if flowering stage is in progress.',
      urgency: 'NORMAL',
      category: 'CROP',
      completed: false,
      dueDate: 'Within 48 hours',
      impactIfIgnored: 'Early infestation can destroy up to 40% of harvest if unnoticed.',
    });
  }

  return actions;
}

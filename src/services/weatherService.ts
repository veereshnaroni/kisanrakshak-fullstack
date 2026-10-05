import { WeatherData } from '../types';

export interface KarnatakaLocation {
  district: string;
  taluk: string;
  latitude: number;
  longitude: number;
}

export const KARNATAKA_LOCATIONS: KarnatakaLocation[] = [
  { district: 'Kalaburagi', taluk: 'Kalaburagi', latitude: 17.3297, longitude: 76.8343 },
  { district: 'Kalaburagi', taluk: 'Aland', latitude: 17.5614, longitude: 76.5701 },
  { district: 'Kalaburagi', taluk: 'Afzalpur', latitude: 17.2023, longitude: 76.3533 },
  { district: 'Kalaburagi', taluk: 'Chittapur', latitude: 17.1197, longitude: 77.0864 },
  { district: 'Kalaburagi', taluk: 'Sedam', latitude: 17.1772, longitude: 77.2941 },
  { district: 'Belagavi', taluk: 'Belagavi', latitude: 15.8497, longitude: 74.4977 },
  { district: 'Belagavi', taluk: 'Chikkodi', latitude: 16.4326, longitude: 74.5956 },
  { district: 'Belagavi', taluk: 'Gokak', latitude: 16.1667, longitude: 74.8333 },
  { district: 'Belagavi', taluk: 'Athani', latitude: 16.7324, longitude: 75.0628 },
  { district: 'Vijayapura', taluk: 'Vijayapura', latitude: 16.8302, longitude: 75.7100 },
  { district: 'Vijayapura', taluk: 'Indi', latitude: 17.1764, longitude: 75.9614 },
  { district: 'Raichur', taluk: 'Raichur', latitude: 16.2120, longitude: 77.3439 },
  { district: 'Raichur', taluk: 'Sindhanur', latitude: 15.7766, longitude: 76.7578 },
  { district: 'Ballari', taluk: 'Ballari', latitude: 15.1394, longitude: 76.9214 },
  { district: 'Bagalkot', taluk: 'Bagalkot', latitude: 16.1800, longitude: 75.6965 },
  { district: 'Dharwad', taluk: 'Hubballi', latitude: 15.3647, longitude: 75.1240 },
  { district: 'Shivamogga', taluk: 'Shivamogga', latitude: 13.9299, longitude: 75.5681 },
  { district: 'Mysuru', taluk: 'Mysuru', latitude: 12.2958, longitude: 76.6394 },
  { district: 'Mandya', taluk: 'Mandya', latitude: 12.5218, longitude: 76.8951 },
  { district: 'Haveri', taluk: 'Haveri', latitude: 14.7958, longitude: 75.3986 },
];

// Fallback data if offline or network failure
const getFallbackWeatherData = (district: string, taluk: string): WeatherData => ({
  district,
  taluk,
  village: 'Kalyan Nagar Village',
  latitude: 17.3297,
  longitude: 76.8343,
  temperature: 31,
  feelsLike: 32,
  weatherCondition: 'Clear & Sunny',
  weatherCode: 0,
  humidity: 45,
  windSpeedKmh: 12,
  windDirectionDeg: 190,
  rainProbability: 10,
  rainfallMmNext24h: 0,
  lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isLive: false,
  hourly: [
    { time: '09:00', temperature: 27, rainProbability: 5, condition: 'Clear Sky' },
    { time: '12:00', temperature: 32, rainProbability: 10, condition: 'Sunny' },
    { time: '15:00', temperature: 33, rainProbability: 15, condition: 'Partly Cloudy' },
    { time: '18:00', temperature: 30, rainProbability: 10, condition: 'Clear' },
    { time: '21:00', temperature: 26, rainProbability: 5, condition: 'Clear Sky' },
  ],
  forecast: [
    { date: 'Today', dayName: 'Today', tempMax: 33, tempMin: 22, rainProbability: 10, rainfallMm: 0, condition: 'Clear Sky', riskSummary: 'Normal / Safe Conditions' },
    { date: 'Tomorrow', dayName: 'Tomorrow', tempMax: 34, tempMin: 22, rainProbability: 15, rainfallMm: 0, condition: 'Sunny', riskSummary: 'Normal' },
    { date: 'Day 3', dayName: 'Wednesday', tempMax: 33, tempMin: 23, rainProbability: 20, rainfallMm: 2, condition: 'Partly Cloudy', riskSummary: 'Light Showers Possible' },
    { date: 'Day 4', dayName: 'Thursday', tempMax: 32, tempMin: 22, rainProbability: 35, rainfallMm: 8, condition: 'Scattered Showers', riskSummary: 'Soil Moisture Replenishment' },
    { date: 'Day 5', dayName: 'Friday', tempMax: 33, tempMin: 23, rainProbability: 20, rainfallMm: 0, condition: 'Sunny', riskSummary: 'Normal' },
    { date: 'Day 6', dayName: 'Saturday', tempMax: 34, tempMin: 24, rainProbability: 10, rainfallMm: 0, condition: 'Clear Sky', riskSummary: 'Normal' },
    { date: 'Day 7', dayName: 'Sunday', tempMax: 35, tempMin: 25, rainProbability: 10, rainfallMm: 0, condition: 'Warm & Clear', riskSummary: 'Normal' },
  ],
});

export async function fetchLiveWeatherData(
  district = 'Kalaburagi',
  taluk = 'Kalaburagi'
): Promise<WeatherData> {
  const loc = KARNATAKA_LOCATIONS.find(
    (l) => l.district.toLowerCase() === district.toLowerCase() && l.taluk.toLowerCase() === taluk.toLowerCase()
  ) || KARNATAKA_LOCATIONS[0];

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=7`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Weather API returned status: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const weatherCodeToString = (code: number): string => {
      if (code === 0) return 'Clear Sky';
      if (code === 1 || code === 2) return 'Mainly Clear / Partly Cloudy';
      if (code === 3) return 'Overcast';
      if (code >= 45 && code <= 48) return 'Foggy';
      if (code >= 51 && code <= 55) return 'Light Drizzle';
      if (code >= 61 && code <= 65) return code >= 65 ? 'Heavy Rainfall' : 'Moderate Rain';
      if (code >= 80 && code <= 82) return 'Rain Showers';
      if (code >= 95) return 'Thunderstorm';
      return 'Cloudy';
    };

    // Calculate hourly breakdown for next 5 slots
    const nowHour = new Date().getHours();
    const hourlyItems = [];
    for (let i = 0; i < 5; i++) {
      const targetIndex = (nowHour + (i + 1) * 3) % 24;
      const hourLabel = `${String(targetIndex).padStart(2, '0')}:00`;
      hourlyItems.push({
        time: hourLabel,
        temperature: Math.round(hourly.temperature_2m?.[targetIndex] ?? current.temperature_2m),
        rainProbability: Math.round(hourly.precipitation_probability?.[targetIndex] ?? 40),
        condition: weatherCodeToString(hourly.weather_code?.[targetIndex] ?? current.weather_code),
      });
    }

    const forecastDays = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    const forecast = daily.time.map((_: string, idx: number) => {
      const pSum = Math.round((daily.precipitation_sum?.[idx] || 0) * 10) / 10;
      const pProb = daily.precipitation_probability_max?.[idx] || 0;
      let summary = 'Normal Conditions';
      if (pSum > 50 || pProb > 70) summary = 'High Waterlogging Risk';
      else if (pSum > 20) summary = 'Moderate Rainfall Alert';
      else if ((daily.temperature_2m_max?.[idx] || 30) > 38) summary = 'High Heat Stress';

      const dateObj = new Date(daily.time[idx]);
      const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date: daily.time[idx],
        dayName,
        tempMax: Math.round(daily.temperature_2m_max[idx]),
        tempMin: Math.round(daily.temperature_2m_min[idx]),
        rainProbability: pProb,
        rainfallMm: pSum,
        condition: weatherCodeToString(daily.weather_code[idx]),
        riskSummary: summary,
      };
    });

    const todayPrecipSum = daily.precipitation_sum?.[0] !== undefined
      ? Math.round(Number(daily.precipitation_sum[0]) * 10) / 10
      : 0;
    const todayPrecipProb = daily.precipitation_probability_max?.[0] !== undefined
      ? Math.round(Number(daily.precipitation_probability_max[0]))
      : 0;

    return {
      district: loc.district,
      taluk: loc.taluk,
      village: 'Kalyan Nagar Village',
      latitude: loc.latitude,
      longitude: loc.longitude,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      weatherCondition: weatherCodeToString(current.weather_code),
      weatherCode: current.weather_code,
      humidity: Math.round(current.relative_humidity_2m),
      windSpeedKmh: Math.round(current.wind_speed_10m),
      windDirectionDeg: Math.round(current.wind_direction_10m),
      rainProbability: todayPrecipProb,
      rainfallMmNext24h: todayPrecipSum,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLive: true,
      hourly: hourlyItems,
      forecast,
    };
  } catch (error) {
    console.warn('Weather fetch encountered network limitation, falling back to cached Karnataka meteorological dataset', error);
    return getFallbackWeatherData(loc.district, loc.taluk);
  }
}

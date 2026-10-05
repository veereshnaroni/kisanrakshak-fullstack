import React, { useState } from 'react';
import {
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  RefreshCw,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sun,
  CloudSun,
} from 'lucide-react';
import { WeatherData } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface WeatherCardProps {
  weather: WeatherData;
  isLoading: boolean;
  onRefresh: () => void;
  onChangeLocation: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  isLoading,
  onRefresh,
  onChangeLocation,
}) => {
  const { t } = useLanguage();
  const [show7Day, setShow7Day] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E4] p-5 sm:p-6 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8E4] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#17211B]">
              {t('weather.title', "Today's Weather")}
            </h2>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                weather.isLive ? 'bg-[#EAF6EE] text-[#146B3A]' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {weather.isLive ? 'Live Radar Feeds' : 'Cached Advisory'}
            </span>
          </div>
          <p className="text-xs text-[#65736B] mt-0.5">
            {weather.taluk}, {weather.district} District • Last synced: {weather.lastUpdated}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onChangeLocation}
            className="text-xs text-[#146B3A] font-semibold hover:underline px-2 py-1 rounded bg-[#F7F9F8] border border-[#E2E8E4]"
          >
            Change Taluk
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-xs text-[#17211B] font-semibold hover:bg-[#EAF6EE] px-2.5 py-1 rounded-lg border border-[#E2E8E4] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#146B3A]' : ''}`} />
            <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Main Reading & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left: Temperature & Condition */}
        <div className="md:col-span-5 flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF6EE] flex items-center justify-center text-[#146B3A] shrink-0">
            {weather.rainProbability > 60 ? (
              <CloudRain className="w-9 h-9 text-[#146B3A]" />
            ) : weather.temperature > 32 ? (
              <Sun className="w-9 h-9 text-amber-500" />
            ) : (
              <CloudSun className="w-9 h-9 text-[#1F8A4C]" />
            )}
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-extrabold text-[#17211B]">{weather.temperature}°C</span>
              <span className="text-xs text-[#65736B]">
                (Feels {weather.feelsLike}°C)
              </span>
            </div>
            <div className="text-sm font-semibold text-[#146B3A] mt-0.5">
              {weather.weatherCondition}
            </div>
            <div className="text-xs text-[#65736B]">
              Expected Rain in 24h: <strong className="text-[#17211B]">{weather.rainfallMmNext24h} mm</strong>
            </div>
          </div>
        </div>

        {/* Right: Key Micro-Climate Gauges */}
        <div className="md:col-span-7 grid grid-cols-3 gap-2 sm:gap-3 bg-[#F7F9F8] p-3 sm:p-4 rounded-xl border border-[#E2E8E4]">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[11px] text-[#65736B] flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" /> Humidity
            </span>
            <span className="text-base sm:text-lg font-bold text-[#17211B] mt-0.5">
              {weather.humidity}%
            </span>
            <span className="text-[10px] text-[#65736B]">Saturated</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center border-x border-[#E2E8E4]">
            <span className="text-[11px] text-[#65736B] flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-600" /> Wind Speed
            </span>
            <span className="text-base sm:text-lg font-bold text-[#17211B] mt-0.5">
              {weather.windSpeedKmh} km/h
            </span>
            <span className="text-[10px] text-[#65736B]">SW Gusts</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[11px] text-[#65736B] flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-[#146B3A]" /> Rain Chance
            </span>
            <span className="text-base sm:text-lg font-bold text-[#146B3A] mt-0.5">
              {weather.rainProbability}%
            </span>
            <span className="text-[10px] text-[#DC4444] font-semibold">High Potential</span>
          </div>
        </div>
      </div>

      {/* Hourly Quick Strip */}
      <div className="mt-4 pt-4 border-t border-[#E2E8E4]">
        <div className="text-xs font-semibold text-[#65736B] mb-2 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#146B3A]" /> Hourly Trend Today
        </div>
        <div className="grid grid-cols-5 gap-2 text-center overflow-x-auto">
          {weather.hourly.map((h, i) => (
            <div key={i} className="bg-[#F7F9F8] p-2 rounded-lg border border-[#E2E8E4]">
              <span className="text-[11px] font-semibold text-[#65736B] block">{h.time}</span>
              <span className="text-sm font-bold text-[#17211B] block mt-0.5">{h.temperature}°C</span>
              <span className="text-[10px] text-blue-600 font-medium block">
                {h.rainProbability}% rain
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Toggle */}
      <div className="mt-4 pt-3 border-t border-[#E2E8E4] flex items-center justify-between">
        <button
          onClick={() => setShow7Day(!show7Day)}
          className="text-xs font-bold text-[#146B3A] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{show7Day ? 'Hide 7-Day Agricultural Forecast' : 'View 7-Day Agricultural Forecast'}</span>
          {show7Day ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <span className="text-[11px] text-[#65736B]">
          Precipitation advisory verified with KSNDMC
        </span>
      </div>

      {show7Day && (
        <div className="mt-3 space-y-2">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E2E8E4] text-xs"
            >
              <div className="w-24 font-bold text-[#17211B]">{day.dayName}</div>
              <div className="text-[#65736B] flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                <span>{day.rainfallMm} mm ({day.rainProbability}%)</span>
              </div>
              <div className="text-[#17211B] font-semibold">
                {day.tempMax}° / {day.tempMin}°
              </div>
              <div className="hidden sm:block text-right">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    day.rainfallMm > 40
                      ? 'bg-red-100 text-red-700'
                      : day.rainfallMm > 15
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {day.riskSummary}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

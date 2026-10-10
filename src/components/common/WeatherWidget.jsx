import React, { useState, useEffect } from 'react';
import { CloudSun, Droplets, CloudRain, Wind, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchDistrictWeather } from '../../services/weatherService';
import { useLanguage } from '../../context/LanguageContext';

export const WeatherWidget = ({ defaultDistrict = "Jalgaon" }) => {
  const { t } = useLanguage();
  const [district, setDistrict] = useState(defaultDistrict);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const districtsList = ["Jalgaon", "Nashik", "Pune", "Ahmednagar", "Nagpur"];

  const loadWeather = async (distName) => {
    setLoading(true);
    const data = await fetchDistrictWeather(distName);
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWeather(district);
  }, [district]);

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
      {/* Background Subtle Leaf Design */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-300 shrink-0" />
          <select 
            value={district} 
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-emerald-950/60 text-white font-medium text-sm rounded-lg px-2.5 py-1 border border-emerald-600/40 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
          >
            {districtsList.map(d => (
              <option key={d} value={d} className="bg-emerald-900 text-white">{d} {t('district')}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => loadWeather(district)}
          className="p-1.5 hover:bg-emerald-700/50 rounded-lg transition-colors text-emerald-200"
          title={t('refreshWeather')}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-6 text-center text-emerald-200 text-sm animate-pulse flex items-center justify-center gap-2">
          <CloudSun className="w-5 h-5 animate-bounce" /> {t('fetchingWeather')}
        </div>
      ) : weather ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-extrabold tracking-tight">{weather.temp}°C</div>
              <div className="text-emerald-200 text-sm font-medium">{t(weather.condition)}</div>
            </div>
            <div className="bg-emerald-700/40 p-3 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
              <CloudSun className="w-10 h-10 text-amber-300" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-700/30 text-xs mb-3">
            <div className="flex flex-col items-center justify-center p-1">
              <Droplets className="w-4 h-4 text-blue-300 mb-1" />
              <span className="text-emerald-300">{t('humidity')}</span>
              <span className="font-bold text-white mt-0.5">{weather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 border-x border-emerald-700/30">
              <CloudRain className="w-4 h-4 text-sky-300 mb-1" />
              <span className="text-emerald-300">{t('rainProb')}</span>
              <span className="font-bold text-white mt-0.5">{weather.rainProb}%</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
              <Wind className="w-4 h-4 text-teal-300 mb-1" />
              <span className="text-emerald-300">{t('wind')}</span>
              <span className="font-bold text-white mt-0.5">{weather.windSpeed}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-amber-500/20 border border-amber-400/30 p-2.5 rounded-xl text-xs text-amber-100">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-200">{t('farmingAdvisory')} </span>
              {t(weather.advice)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

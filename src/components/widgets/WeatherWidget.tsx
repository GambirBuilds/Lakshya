import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Cloud, Sun, CloudRain, Wind, Droplets, RefreshCw, AlertCircle } from 'lucide-react';

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
}

export const WeatherWidget: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  const fetchRealWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Geocode city via open-meteo geocoding
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Location "${cityName}" not found.`);
      }

      const { latitude, longitude, name } = geoData.results[0];

      // 2. Fetch current weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
      );
      const wData = await weatherRes.json();
      const current = wData.current;

      let condition = 'Clear Skies';
      if (current.weather_code >= 51 && current.weather_code <= 67) condition = 'Rainy';
      else if (current.weather_code >= 1 && current.weather_code <= 3) condition = 'Partly Cloudy';
      else if (current.weather_code >= 71) condition = 'Snowy';
      else if (current.weather_code >= 95) condition = 'Thunderstorm';

      setWeather({
        city: name,
        temperature: Math.round(current.temperature_2m),
        condition,
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
      });
      setIsEnabled(true);
    } catch (err) {
      setError((err as Error).message || 'Unable to retrieve real meteorological data.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">Meteorology</h3>
            <p className="text-[11px] text-slate-400">Live environmental weather feed</p>
          </div>
        </div>
        {isEnabled && (
          <button
            onClick={() => fetchRealWeather(settings.weatherCity || 'Kathmandu')}
            disabled={loading}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Refresh weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {!isEnabled ? (
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center space-y-2.5">
          <p className="text-xs text-slate-400">
            Weather integration connects to free real-time Open-Meteo telemetry (no fake mock numbers).
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              defaultValue={settings.weatherCity || 'Kathmandu'}
              id="weather-city-input"
              placeholder="City (e.g. Kathmandu, London)"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => {
                const el = document.getElementById('weather-city-input') as HTMLInputElement;
                const city = el?.value || 'Kathmandu';
                updateSettings({ weatherCity: city });
                fetchRealWeather(city);
              }}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shrink-0"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
          {error && (
            <p className="text-[11px] text-rose-400 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
        </div>
      ) : weather ? (
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">{weather.city}</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {weather.temperature}°C
              </span>
              <span className="text-[11px] text-slate-300 block font-medium mt-0.5">
                {weather.condition}
              </span>
            </div>
            <div className="text-right space-y-1 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-1.5 justify-end">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span>{weather.humidity}% humidity</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <Wind className="w-3 h-3 text-teal-400" />
                <span>{weather.windSpeed} km/h wind</span>
              </div>
              <div>Feels like {weather.feelsLike}°C</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, Clock, Sun, Moon } from 'lucide-react';

interface CityTime {
  name: string;
  timeZone: string;
  time: string;
  period: string;
  day: string;
  isNight: boolean;
}

const CITY_TIMEZONES: Record<string, string> = {
  Kathmandu: 'Asia/Kathmandu',
  London: 'Europe/London',
  'New York': 'America/New_York',
  Tokyo: 'Asia/Tokyo',
  Sydney: 'Australia/Sydney',
  Dubai: 'Asia/Dubai',
  Paris: 'Europe/Paris',
};

export const WorldClockWidget: React.FC = () => {
  const { settings } = useApp();
  const [cityTimes, setCityTimes] = useState<CityTime[]>([]);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const cities = settings.worldClockCities || ['Kathmandu', 'London', 'New York', 'Tokyo'];

      const results: CityTime[] = cities.map((city) => {
        const timeZone = CITY_TIMEZONES[city] || 'UTC';
        try {
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            weekday: 'short',
          });

          const parts = formatter.formatToParts(now);
          const hourPart = parts.find((p) => p.type === 'hour')?.value || '12';
          const minPart = parts.find((p) => p.type === 'minute')?.value || '00';
          const secPart = parts.find((p) => p.type === 'second')?.value || '00';
          const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value || 'AM';
          const weekday = parts.find((p) => p.type === 'weekday')?.value || '';

          // Determine if nighttime (roughly 8 PM - 6 AM)
          let hour24 = parseInt(hourPart, 10);
          if (dayPeriod.toLowerCase() === 'pm' && hour24 < 12) hour24 += 12;
          if (dayPeriod.toLowerCase() === 'am' && hour24 === 12) hour24 = 0;
          const isNight = hour24 < 6 || hour24 >= 20;

          return {
            name: city,
            timeZone,
            time: `${hourPart}:${minPart}:${secPart}`,
            period: dayPeriod,
            day: weekday,
            isNight,
          };
        } catch {
          return {
            name: city,
            timeZone,
            time: '00:00:00',
            period: 'AM',
            day: '',
            isNight: false,
          };
        }
      });

      setCityTimes(results);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [settings.worldClockCities]);

  return (
    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">World Chronometer</h3>
            <p className="text-[11px] text-slate-400">Synchronized browser timezone feeds</p>
          </div>
        </div>
        <span className="text-[10px] text-teal-400 font-mono font-semibold bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
          Live Realtime
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {cityTimes.map((c) => (
          <div
            key={c.name}
            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-200 block truncate">{c.name}</span>
              <span className="text-[10px] text-slate-400 font-mono block">{c.day}</span>
              <div className="flex items-baseline gap-1 mt-1 font-mono">
                <span className="text-sm font-black text-amber-400">{c.time}</span>
                <span className="text-[10px] text-slate-400 font-semibold">{c.period}</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-400">
              {c.isNight ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

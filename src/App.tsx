import React, { useState } from 'react';
import { Cloud, Sun, Search, Wind, Droplets, Thermometer, CloudRain, CloudSnow, CloudLightning, Cloudy } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Free API key for demo purposes

function getWeatherIcon(condition: string) {
  const lowercaseCondition = condition.toLowerCase();
  if (lowercaseCondition.includes('rain')) return <CloudRain className="h-16 w-16 text-blue-500 mr-4" />;
  if (lowercaseCondition.includes('snow')) return <CloudSnow className="h-16 w-16 text-gray-300 mr-4" />;
  if (lowercaseCondition.includes('thunder')) return <CloudLightning className="h-16 w-16 text-yellow-500 mr-4" />;
  if (lowercaseCondition.includes('cloud')) return <Cloudy className="h-16 w-16 text-gray-500 mr-4" />;
  return <Sun className="h-16 w-16 text-yellow-500 mr-4" />;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState<WeatherData>({
    location: 'New York',
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}&units=imperial`
      );

      if (!response.ok) {
        throw new Error('City not found. Please try another location.');
      }

      const data = await response.json();
      
      setWeather({
        location: data.name + ', ' + data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
      });
      
      setSearchQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <Cloud className="h-8 w-8 text-blue-500" />
          Weather Dashboard
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a city (e.g., London, GB)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white shadow-md pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
            <button
              type="submit"
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 ${
                loading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={loading}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </form>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">{weather.location}</h2>
              <div className="flex items-center justify-center md:justify-start mt-4">
                {getWeatherIcon(weather.condition)}
                <div>
                  <span className="text-5xl font-bold text-gray-800">{weather.temperature}°F</span>
                  <p className="text-gray-600 mt-1">{weather.condition}</p>
                </div>
              </div>
            </div>

            <div className="border-t md:border-l md:border-t-0 pt-4 md:pt-0 md:pl-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Weather Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Thermometer className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Feels Like</p>
                    <p className="font-semibold">{weather.temperature}°F</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="font-semibold">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Wind className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Wind Speed</p>
                    <p className="font-semibold">{weather.windSpeed} mph</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600">Tomorrow + {index} days</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <Cloud className="h-8 w-8 text-gray-400 mr-2" />
                  <span className="text-2xl font-semibold">{Math.round(weather.temperature - index * 2)}°F</span>
                </div>
                <span className="text-gray-500">Cloudy</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import './App.css';
import { 
  Search, 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Thermometer, 
  Gauge, 
  Eye,
  MapPin,
  Calendar,
  RefreshCw,
  Menu,
  X,
  CloudSun,
  CloudLightning
} from 'lucide-react';

function App() {
  // States
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');
  const [recentCities, setRecentCities] = useState(['London', 'Paris', 'Tokyo', 'New York']);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');

  // Popular cities
  const popularCities = [
    'London', 'Paris', 'New York', 'Tokyo', 
    'Dubai', 'Sydney', 'Berlin', 'Madrid',
    'Rome', 'Moscow', 'Cairo', 'Mumbai'
  ];

  // Fetch weather data
  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `http://localhost:3001/api/weather/current?city=${cityName}&units=${unit}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('City not found or server error');
      }
      
      const weatherResult = await weatherResponse.json();
      
      if (weatherResult.success) {
        setWeatherData(weatherResult.data);
        
        // Update recent cities
        if (!recentCities.includes(cityName)) {
          setRecentCities(prev => [cityName, ...prev.slice(0, 4)]);
        }
        
        // Fetch forecast data
        const forecastResponse = await fetch(
          `http://localhost:3001/api/weather/forecast?city=${cityName}&units=${unit}`
        );
        
        if (forecastResponse.ok) {
          const forecastResult = await forecastResponse.json();
          if (forecastResult.success) {
            setForecastData(forecastResult.data);
          }
        }
      } else {
        throw new Error(weatherResult.error || 'Failed to fetch weather data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  // Handle city click
  const handleCityClick = (cityName) => {
    setCity(cityName);
    fetchWeather(cityName);
  };

  // Handle unit change
  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    if (weatherData) {
      fetchWeather(weatherData.city.name);
    }
  };

  // Refresh weather
  const handleRefresh = () => {
    if (weatherData) {
      fetchWeather(weatherData.city.name);
    }
  };

  // Get weather icon
  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('clear')) return <Sun className="weather-icon sun" />;
    if (conditionLower.includes('cloud')) return <Cloud className="weather-icon cloud" />;
    if (conditionLower.includes('rain')) return <CloudRain className="weather-icon rain" />;
    if (conditionLower.includes('snow')) return <CloudSnow className="weather-icon snow" />;
    if (conditionLower.includes('thunder')) return <CloudLightning className="weather-icon thunder" />;
    if (conditionLower.includes('drizzle')) return <CloudRain className="weather-icon drizzle" />;
    return <CloudSun className="weather-icon" />;
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get temperature unit
  const getTempUnit = () => {
    return unit === 'metric' ? '°C' : unit === 'imperial' ? '°F' : 'K';
  };

  // Get wind unit
  const getWindUnit = () => {
    return unit === 'metric' ? 'm/s' : unit === 'imperial' ? 'mph' : 'm/s';
  };

  // Initial load
  useEffect(() => {
    fetchWeather('London');
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2><Menu className="icon" /> Weather Menu</h2>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="sidebar-section">
          <h3><MapPin className="icon" /> Recent Cities</h3>
          <div className="city-list">
            {recentCities.map((cityName, index) => (
              <button
                key={index}
                className="city-btn"
                onClick={() => handleCityClick(cityName)}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
        
        <div className="sidebar-section">
          <h3><Thermometer className="icon" /> Temperature Unit</h3>
          <div className="unit-selector">
            <button 
              className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
              onClick={() => handleUnitChange('metric')}
            >
              °C (Metric)
            </button>
            <button 
              className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
              onClick={() => handleUnitChange('imperial')}
            >
              °F (Imperial)
            </button>
            <button 
              className={`unit-btn ${unit === 'standard' ? 'active' : ''}`}
              onClick={() => handleUnitChange('standard')}
            >
              K (Standard)
            </button>
          </div>
        </div>
        
        <div className="sidebar-section">
          <h3><Cloud className="icon" /> Popular Cities</h3>
          <div className="city-grid">
            {popularCities.map((cityName, index) => (
              <button
                key={index}
                className="popular-city"
                onClick={() => handleCityClick(cityName)}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="app-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="app-title">🌤️ METEO Weather App</h1>
          <div className="header-actions">
            <button 
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search for a city..."
                className="search-input"
              />
              <button type="submit" className="search-btn" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            <Sun className="icon" /> Current Weather
          </button>
          <button 
            className={`tab-btn ${activeTab === 'forecast' ? 'active' : ''}`}
            onClick={() => setActiveTab('forecast')}
          >
            <Calendar className="icon" /> 5-Day Forecast
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {/* Current Weather */}
        {!loading && weatherData && activeTab === 'current' && (
          <div className="weather-container">
            <div className="current-weather-card">
              <div className="weather-header">
                <div className="location">
                  <MapPin className="icon" />
                  <h2>{weatherData.city.name}, {weatherData.city.country}</h2>
                </div>
                <div className="date-time">
                  <p>{formatDate(weatherData.timestamp)}</p>
                  <p className="time">{formatTime(weatherData.timestamp)}</p>
                </div>
              </div>

              <div className="weather-main">
                <div className="temperature-section">
                  <div className="current-temp">
                    <span className="temp-value">{weatherData.weather.temperature.current}</span>
                    <span className="temp-unit">{getTempUnit()}</span>
                  </div>
                  <div className="temp-range">
                    <span className="temp-min">↓ {weatherData.weather.temperature.min}{getTempUnit()}</span>
                    <span className="temp-max">↑ {weatherData.weather.temperature.max}{getTempUnit()}</span>
                  </div>
                  <div className="weather-condition">
                    {getWeatherIcon(weatherData.weather.main)}
                    <h3>{weatherData.weather.description}</h3>
                  </div>
                  <div className="feels-like">
                    Feels like {weatherData.weather.temperature.feels_like}{getTempUnit()}
                  </div>
                </div>

                <div className="weather-details">
                  <div className="detail-card">
                    <Wind className="icon" />
                    <div>
                      <h4>Wind</h4>
                      <p>{weatherData.weather.wind.speed} {getWindUnit()}</p>
                      <small>Direction: {weatherData.weather.wind.direction}°</small>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <Droplets className="icon" />
                    <div>
                      <h4>Humidity</h4>
                      <p>{weatherData.weather.humidity}%</p>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <Gauge className="icon" />
                    <div>
                      <h4>Pressure</h4>
                      <p>{weatherData.weather.pressure} hPa</p>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <Eye className="icon" />
                    <div>
                      <h4>Visibility</h4>
                      <p>{(weatherData.weather.visibility / 1000).toFixed(1)} km</p>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <Cloud className="icon" />
                    <div>
                      <h4>Cloudiness</h4>
                      <p>{weatherData.weather.clouds}%</p>
                    </div>
                  </div>
                  
                  <div className="detail-card">
                    <Sun className="icon" />
                    <div>
                      <h4>Sunrise/Sunset</h4>
                      <p>{formatTime(weatherData.weather.sunrise * 1000)}</p>
                      <p>{formatTime(weatherData.weather.sunset * 1000)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Tab */}
        {!loading && forecastData && activeTab === 'forecast' && (
          <div className="forecast-container">
            <div className="forecast-header">
              <h2>5-Day Forecast for {forecastData.city.name}</h2>
              <p>3-hour intervals</p>
            </div>
            
            <div className="forecast-days">
              {forecastData.forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <h3>{day.date}</h3>
                  <div className="day-weather">
                    {getWeatherIcon(day.mainWeather.main)}
                    <div className="day-temps">
                      <span className="day-temp-high">
                        ↑ {day.temperature.max}{getTempUnit()}
                      </span>
                      <span className="day-temp-low">
                        ↓ {day.temperature.min}{getTempUnit()}
                      </span>
                    </div>
                    <p className="day-condition">{day.mainWeather.description}</p>
                    <div className="day-details">
                      <span><Droplets size={16} /> {day.humidity}%</span>
                      <span><Wind size={16} /> {day.windSpeed} {getWindUnit()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data State */}
        {!loading && !weatherData && !error && (
          <div className="welcome-container">
            <div className="welcome-card">
              <CloudSun size={64} className="welcome-icon" />
              <h2>Welcome to METEO Weather</h2>
              <p>Search for a city to get current weather and forecast information</p>
              <div className="quick-cities">
                <p>Try these cities:</p>
                <div className="quick-buttons">
                  {popularCities.slice(0, 6).map((cityName, index) => (
                    <button
                      key={index}
                      className="quick-btn"
                      onClick={() => handleCityClick(cityName)}
                    >
                      {cityName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
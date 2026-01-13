const ApiService = require('./api.service');
const NodeCache = require('node-cache');
const constants = require('../config/constants');

class WeatherService {
  constructor() {
    this.apiService = ApiService;
    this.cache = new NodeCache({ stdTTL: constants.CACHE_TTL.WEATHER });
  }

  async getCurrentWeather(city, units = 'metric', lang = 'en') {
    const cacheKey = `weather_${city}_${units}_${lang}`;
    
    // Check cache first
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const weatherData = await this.apiService.getCurrentWeather(city, units, lang);
      
      // Transform data for frontend
      const transformedData = this.transformWeatherData(weatherData);
      
      // Cache the result
      this.cache.set(cacheKey, transformedData);
      
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async getWeatherForecast(city, units = 'metric', lang = 'en') {
    const cacheKey = `forecast_${city}_${units}_${lang}`;
    
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const forecastData = await this.apiService.getWeatherForecast(city, units, lang);
      
      // Transform and group forecast data
      const transformedData = this.transformForecastData(forecastData);
      
      this.cache.set(cacheKey, transformedData);
      
      return transformedData;
    } catch (error) {
      throw error;
    }
  }

  async getWeatherForMultipleCities(cities, units = 'metric', lang = 'en') {
    try {
      const promises = cities.map(city => 
        this.getCurrentWeather(city, units, lang).catch(error => ({
          city: city,
          error: error.message,
          success: false
        }))
      );

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      throw error;
    }
  }

  transformWeatherData(data) {
    return {
      city: {
        name: data.name,
        country: data.sys.country,
        coord: data.coord
      },
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        temperature: {
          current: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          min: Math.round(data.main.temp_min),
          max: Math.round(data.main.temp_max)
        },
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind: {
          speed: data.wind.speed,
          direction: data.wind.deg,
          gust: data.wind.gust || 0
        },
        visibility: data.visibility,
        clouds: data.clouds.all,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone
      },
      timestamp: new Date().toISOString()
    };
  }

  transformForecastData(data) {
    const dailyForecast = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          date: date,
          temps: [],
          weather: [],
          humidity: [],
          wind: []
        };
      }
      
      dailyForecast[date].temps.push(item.main.temp);
      dailyForecast[date].weather.push(item.weather[0]);
      dailyForecast[date].humidity.push(item.main.humidity);
      dailyForecast[date].wind.push(item.wind.speed);
    });

    return {
      city: data.city,
      forecast: Object.values(dailyForecast).map(day => ({
        date: day.date,
        temperature: {
          min: Math.round(Math.min(...day.temps)),
          max: Math.round(Math.max(...day.temps)),
          avg: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length)
        },
        mainWeather: this.getMostFrequentWeather(day.weather),
        humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        windSpeed: Math.round((day.wind.reduce((a, b) => a + b, 0) / day.wind.length) * 10) / 10
      }))
    };
  }

  getMostFrequentWeather(weatherArray) {
    const frequency = {};
    let maxCount = 0;
    let mostFrequent;
    
    weatherArray.forEach(weather => {
      frequency[weather.main] = (frequency[weather.main] || 0) + 1;
      if (frequency[weather.main] > maxCount) {
        maxCount = frequency[weather.main];
        mostFrequent = weather;
      }
    });
    
    return mostFrequent;
  }
}

module.exports = new WeatherService();
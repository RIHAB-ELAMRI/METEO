const weatherService = require('../services/weather.service');
const constants = require('../config/constants');

class WeatherController {
  async getCurrentWeather(req, res, next) {
    try {
      const { city, units = 'metric', lang = 'en' } = req.query;
      
      if (!city) {
        return res.status(400).json({
          success: false,
          error: 'City parameter is required'
        });
      }

      const weatherData = await weatherService.getCurrentWeather(city, units, lang);
      
      res.status(200).json({
        success: true,
        message: constants.SUCCESS_MESSAGES.WEATHER_FETCHED,
        data: weatherData
      });
    } catch (error) {
      next(error);
    }
  }

  async getWeatherForecast(req, res, next) {
    try {
      const { city, units = 'metric', lang = 'en' } = req.query;
      
      if (!city) {
        return res.status(400).json({
          success: false,
          error: 'City parameter is required'
        });
      }

      const forecastData = await weatherService.getWeatherForecast(city, units, lang);
      
      res.status(200).json({
        success: true,
        message: constants.SUCCESS_MESSAGES.FORECAST_FETCHED,
        data: forecastData
      });
    } catch (error) {
      next(error);
    }
  }

  async getMultipleCitiesWeather(req, res, next) {
    try {
      const { cities, units = 'metric', lang = 'en' } = req.body;
      
      if (!cities || !Array.isArray(cities) || cities.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Cities array is required'
        });
      }

      const weatherData = await weatherService.getWeatherForMultipleCities(cities, units, lang);
      
      res.status(200).json({
        success: true,
        message: 'Weather data for multiple cities fetched successfully',
        data: weatherData
      });
    } catch (error) {
      next(error);
    }
  }

  async getWeatherByLocation(req, res, next) {
    try {
      const { lat, lon, units = 'metric', lang = 'en' } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude parameters are required'
        });
      }

      const weatherData = await weatherService.getCurrentWeatherByCoords(lat, lon, units, lang);
      
      res.status(200).json({
        success: true,
        message: constants.SUCCESS_MESSAGES.WEATHER_FETCHED,
        data: weatherData
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WeatherController();
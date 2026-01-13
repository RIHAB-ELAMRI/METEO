const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class ApiService {
  constructor() {
    this.openWeatherBaseUrl = process.env.OPENWEATHER_BASE_URL;
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    
    this.axiosInstance = axios.create({
      baseURL: this.openWeatherBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getCurrentWeather(city, units = 'metric', lang = 'en') {
    try {
      const response = await this.axiosInstance.get('/weather', {
        params: {
          q: city,
          appid: this.apiKey,
          units: units,
          lang: lang
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error.message);
      throw new Error(this.handleApiError(error));
    }
  }

  async getWeatherForecast(city, units = 'metric', lang = 'en') {
    try {
      const response = await this.axiosInstance.get('/forecast', {
        params: {
          q: city,
          appid: this.apiKey,
          units: units,
          lang: lang
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error.message);
      throw new Error(this.handleApiError(error));
    }
  }

  async getWeatherByCoordinates(lat, lon, units = 'metric', lang = 'en') {
    try {
      const response = await this.axiosInstance.get('/weather', {
        params: {
          lat: lat,
          lon: lon,
          appid: this.apiKey,
          units: units,
          lang: lang
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error.message);
      throw new Error(this.handleApiError(error));
    }
  }

  handleApiError(error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return 'Invalid API key';
        case 404:
          return 'City not found';
        case 429:
          return 'Rate limit exceeded';
        case 500:
          return 'Internal server error';
        default:
          return 'Error fetching weather data';
      }
    } else if (error.request) {
      return 'Network error - Please check your connection';
    } else {
      return 'An unexpected error occurred';
    }
  }
}

module.exports = new ApiService();
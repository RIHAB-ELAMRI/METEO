module.exports = {
  WEATHER_UNITS: {
    STANDARD: 'standard',
    METRIC: 'metric',
    IMPERIAL: 'imperial'
  },
  
  CACHE_TTL: {
    WEATHER: 600, // 10 minutes in seconds
    FORECAST: 1800 // 30 minutes in seconds
  },
  
  ERROR_MESSAGES: {
    CITY_NOT_FOUND: 'City not found',
    API_ERROR: 'Error fetching weather data',
    INVALID_CITY: 'Invalid city name',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded'
  },
  
  SUCCESS_MESSAGES: {
    WEATHER_FETCHED: 'Weather data fetched successfully',
    FORECAST_FETCHED: 'Forecast data fetched successfully'
  }
};
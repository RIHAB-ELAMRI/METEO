const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');
const validationMiddleware = require('../middleware/validation.middleware');

/**
 * @route GET /api/weather/current
 * @desc Get current weather for a specific city
 * @access Public
 */
router.get('/current', validationMiddleware.validateCity, weatherController.getCurrentWeather);

/**
 * @route GET /api/weather/forecast
 * @desc Get 5-day weather forecast for a specific city
 * @access Public
 */
router.get('/forecast', validationMiddleware.validateCity, weatherController.getWeatherForecast);

/**
 * @route POST /api/weather/multiple
 * @desc Get weather for multiple cities
 * @access Public
 */
router.post('/multiple', validationMiddleware.validateCities, weatherController.getMultipleCitiesWeather);

/**
 * @route GET /api/weather/location
 * @desc Get weather by latitude and longitude
 * @access Public
 */
router.get('/location', validationMiddleware.validateCoords, weatherController.getWeatherByLocation);

module.exports = router;
const { body, query, validationResult } = require('express-validator');

const validateCity = [
  query('city')
    .trim()
    .notEmpty()
    .withMessage('City name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City name must be between 2 and 100 characters')
    .escape(),
  
  query('units')
    .optional()
    .isIn(['standard', 'metric', 'imperial'])
    .withMessage('Units must be standard, metric, or imperial'),
  
  query('lang')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be between 2 and 5 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

const validateCities = [
  body('cities')
    .isArray({ min: 1, max: 20 })
    .withMessage('Cities must be an array with 1 to 20 items'),
  
  body('cities.*')
    .trim()
    .notEmpty()
    .withMessage('Each city name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Each city name must be between 2 and 100 characters')
    .escape(),
  
  body('units')
    .optional()
    .isIn(['standard', 'metric', 'imperial'])
    .withMessage('Units must be standard, metric, or imperial'),
  
  body('lang')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be between 2 and 5 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

const validateCoords = [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  query('lon')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  query('units')
    .optional()
    .isIn(['standard', 'metric', 'imperial'])
    .withMessage('Units must be standard, metric, or imperial'),
  
  query('lang')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be between 2 and 5 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateCity,
  validateCities,
  validateCoords
};
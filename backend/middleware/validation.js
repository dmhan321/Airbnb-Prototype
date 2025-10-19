const Joi = require('joi');

// Validation schemas
const schemas = {
  travelerRegistration: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
    aboutMe: Joi.string().max(500).optional(),
    city: Joi.string().max(50).optional(),
    country: Joi.string().max(50).optional(),
    languages: Joi.string().max(100).optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional()
  }),

  ownerRegistration: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    location: Joi.string().min(2).max(100).required(),
    phone: Joi.string().optional(),
    aboutMe: Joi.string().max(500).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    userType: Joi.string().valid('traveler', 'owner').required()
  }),

  property: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    type: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(1000).optional(),
    location: Joi.string().min(2).max(200).required(),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().max(50).optional(),
    country: Joi.string().min(2).max(50).required(),
    price: Joi.number().min(0).required(),
    bedrooms: Joi.number().min(0).required(),
    bathrooms: Joi.number().min(0).required(),
    amenities: Joi.string().max(500).optional(),
    maxGuests: Joi.number().min(1).required(),
    availableFrom: Joi.date().optional(),
    availableTo: Joi.date().optional()
  }),

  booking: Joi.object({
    propertyId: Joi.number().integer().positive().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    guests: Joi.number().integer().min(1).required()
  }),

  search: Joi.object({
    location: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    guests: Joi.number().integer().min(1).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional()
  })
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Specific validation middlewares
const validateTravelerRegistration = validate(schemas.travelerRegistration);
const validateOwnerRegistration = validate(schemas.ownerRegistration);
const validateLogin = validate(schemas.login);
const validateProperty = validate(schemas.property);
const validateBooking = validate(schemas.booking);
const validateSearch = validate(schemas.search);

module.exports = {
  validateTravelerRegistration,
  validateOwnerRegistration,
  validateLogin,
  validateProperty,
  validateBooking,
  validateSearch
};


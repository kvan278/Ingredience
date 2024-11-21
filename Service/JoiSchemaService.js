/* eslint-disable prefer-regex-literals */
// services/JoiSchemaService.js

const Joi = require('joi');

class JoiSchemaService {
    // Reusable Types
    static email = Joi.string().email().lowercase().required();
    static password = Joi.string()
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, one letter, and one number'
        });

    static phone = Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
        'string.pattern.base': 'Phone number must be in E.164 format (e.g., +123456789)'
    });

    static dateISO = Joi.date().iso();
    static dateCustom = Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).messages({
        'string.pattern.base': 'Date must be in DD-MM-YYYY format'
    });

    static url = Joi.string().uri();
    static imageUrl = Joi.string().uri().regex(/\.(jpeg|jpg|gif|png)$/).messages({
        'string.pattern.base': 'URL must end with .jpeg, .jpg, .gif, or .png'
    });

    static integer = Joi.number().integer();
    static positiveInteger = Joi.number().integer().positive();
    static negativeInteger = Joi.number().integer().negative();
    static float = Joi.number();
    static positiveFloat = Joi.number().positive();
    static negativeFloat = Joi.number().negative();
    static arrayString = Joi.array().items(Joi.string());
    static arrayInteger = Joi.array().items(Joi.number().integer());
    static ipAddress = Joi.string().ip();
    static ipv4Address = Joi.string().ip({ version: ['ipv4'] });
    static ipv6Address = Joi.string().ip({ version: ['ipv6'] });
    static hexColor = Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).messages({
        'string.pattern.base': 'Must be a valid hex color code'
    });

    static uuid = Joi.string().guid({ version: ['uuidv4', 'uuidv5'] });
    static mongoId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
        'string.pattern.base': 'Must be a valid MongoDB ObjectId'
    });

    static jwt = Joi.string().pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/).messages({
        'string.pattern.base': 'Must be a valid JWT token'
    });

    static creditCard = Joi.string().creditCard();
    static postalCodeUS = Joi.string().pattern(/^\d{5}(-\d{4})?$/).messages({
        'string.pattern.base': 'Must be a valid US postal code'
    });

    static postalCodeCA = Joi.string().pattern(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/).messages({
        'string.pattern.base': 'Must be a valid Canadian postal code'
    });

    static currency = Joi.string().valid('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY');
    static time24h = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
        'string.pattern.base': 'Time must be in HH:mm format'
    });

    static longitude = Joi.number().min(-180).max(180);
    static latitude = Joi.number().min(-90).max(90);
    static boolean = Joi.boolean();
    static age = Joi.number().integer().min(0).max(120).messages({
        'number.base': 'Age must be a number',
        'number.min': 'Age cannot be negative',
        'number.max': 'Age cannot exceed 120'
    });

    static firstName = Joi.string().min(1).max(50).regex(/^[a-zA-Z]+$/).messages({
        'string.pattern.base': 'First name must contain only letters'
    });

    static lastName = Joi.string().min(1).max(50).regex(/^[a-zA-Z]+$/).messages({
        'string.pattern.base': 'Last name must contain only letters'
    });

    static countryCode = Joi.string().length(2).regex(/^[A-Z]{2}$/).messages({
        'string.pattern.base': 'Country code must be two uppercase letters'
    });

    // Reusable Enums
    static userRoles = Joi.string().valid('admin', 'user', 'moderator');
    static categories = Joi.string().valid('electronics', 'clothing', 'home', 'beauty', 'sports');

    // Example Schemas
    static userRegistrationSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: this.email,
        password: this.password,
        phone: this.phone,
        role: this.userRoles.required()
    });

    static productCreationSchema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500),
        price: this.positiveFloat.required(),
        category: this.categories,
        inStock: Joi.boolean().default(true),
        releaseDate: this.dateISO.optional()
    });

    static sendBulkMails = Joi.object({
        subject: Joi.string().required().messages({
            'string.empty': 'Subject is required'
        }),
        body: Joi.string().required().messages({
            'string.empty': 'Body is required'
        }),
        recipients: Joi.alternatives().try(
            Joi.string().valid('ALL_USERS'),
            Joi.array().items(Joi.string().email()).min(1)
        ).required().messages({
            'any.required': 'Recipients are required',
            'array.min': 'At least one recipient is required'
        })
    })

    // Validation Function
    static validate(data, schema) {
        const { error, value } = schema.validate(data, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return { isValid: false, errors: errorMessages };
        }
        return { isValid: true, value };
    }
}

// Usage
// const { isValid, errors, value } = JoiSchemaService.validate(req.query, JoiSchemaService.paginationSchema);

module.exports = JoiSchemaService;

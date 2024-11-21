const Joi = require("joi");

const validateNameDescriptionImage = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.base': 'Name must be a string',
            'any.required': 'Name is required'
        }),
        description: Joi.string().required().messages({
            'string.base': 'Description must be a string',
            'any.required': 'Description is required'
        }),
        imageURL: Joi.string().required().messages({
            'string.base': 'imageURL must be a string',
            'any.required': 'imageURL is required'
        })
    });
    return schema.validate(data);
};

module.exports = {
    validateNameDescriptionImage
}
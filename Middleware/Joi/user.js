const Joi = require("joi");

const signupUser = Joi.object({
    uid: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    createdAt: Joi.number().required()
})

exports.signupUser = signupUser

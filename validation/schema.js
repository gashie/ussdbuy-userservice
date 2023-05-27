const Joi = require('joi');

const schema = {
    usersignup: Joi.object({
        full_name: Joi.string().label("full name"),
        phone_number: Joi.string().required().label("phone"),
        email: Joi.string()
            .email()
            .required()
            .label("email"),
        bio: Joi.string().label("bio"),
        status: Joi.number().required().label("status"),

    }),


};
module.exports = schema;

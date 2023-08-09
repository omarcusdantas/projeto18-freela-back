import joi from "joi";

export const schemaSignup = joi.object({
    name: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    state: joi.string().length(2).pattern(/^[A-Za-z]{2}$/).required(),
    city: joi.string().required(),
    address: joi.string().required(),
    cep: joi.string().length(8).pattern(/^\d+$/).required(),
});

export const schemaSignin = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
});

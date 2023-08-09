import joi from 'joi';

export const serviceSchema = joi.object({
    categoryId: joi.number().integer().required(),
    title: joi.string().max(30).required(),
    description: joi.string().required(),
    image: joi.string().uri().required(),
});
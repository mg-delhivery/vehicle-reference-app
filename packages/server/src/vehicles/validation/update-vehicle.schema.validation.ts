import * as Joi from 'joi';

export const UpdateVehicleSchema = Joi.object({
  properties: Joi.object({
    mode: Joi.string().required(),
    fuelType: Joi.string().required(),
    operatorId: Joi.string().required(),
    payloadCapacity: Joi.string().optional(),
    registrationNumber: Joi.string().optional(),
    registrationYear: Joi.number().optional(),
    availability: Joi.boolean().optional(),
  }).required(),
});

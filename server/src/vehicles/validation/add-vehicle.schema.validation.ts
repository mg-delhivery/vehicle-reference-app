import * as Joi from 'joi';

export const AddVehicleSchema = Joi.object({
  owner: Joi.string().required(),
  name: Joi.string().required(),
  uniqueCode: Joi.string().required(),
  subCategory: Joi.string().optional(),
  properties: Joi.object({
    mode: Joi.string().required(),
    fuelType: Joi.string().required(),
    operatorId: Joi.string().required(),
    payloadCapacity: Joi.string().optional(),
    registrationNumber: Joi.string().optional(),
    registrationYear: Joi.number().optional(),
    availability: Joi.boolean().optional(),
  }).required(),
  callback: Joi.object()
});

const Joi = require("joi");
const joiObjectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message("Invalid ObjectId format");

const joiDateString = Joi.string()
  .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-\d{4}$/)
  .message("Date must be in the format DD-MM-YYYY");

const getAttendanceSchema = Joi.object({
  userId: joiObjectId.required(),
  date: joiDateString.required(),
});

const checkInAndOutSchema = Joi.object({
  userId: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});
module.exports = {
  checkInSchema: checkInAndOutSchema,
  checkOutSchema: checkInAndOutSchema,
  getAttendanceSchema,
};

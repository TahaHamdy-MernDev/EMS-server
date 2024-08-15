const responseCode = {
  success: 200,
  badRequest: 400,
  internalServerError: 500,
  recordNotFound: 404,
  unAuthorized: 401,
  validationError: 422,
  conflict: 409,
  forbidden: 403,
};
const responseStatus = {
  success: "SUCCESS",
  badRequest: "BAD_REQUEST",
  serverError: "SERVER_ERROR",
  recordNotFound: "RECORD_NOT_FOUND",
  failure: "FAILURE",
  validationError: "VALIDATION_ERROR",
  unauthorized: "UNAUTHORIZED",
  conflict: "CONFLICT",
  forbidden: "FORBIDDEN",
};
const responseMessages = {
  success: "Your request is successfully executed",
  failure: "Some error occurred while performing action.",
  internalServerError: "Internal server error.",
  badRequest: "Request parameters are invalid or missing.",
  recordNotFound: `Sorry, can't find this!!!`,
  validationError: "Invalid Data, Validation Failed.",
  unauthorized: "You are not authorized to access the request",
  forbidden:"You do not have the necessary permissions to access this resource.",
  conflict: `The request could not be completed due to a conflict with the current state.`,
};
module.exports = { responseMessages, responseCode, responseStatus };

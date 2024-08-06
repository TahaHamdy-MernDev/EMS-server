const {
  responseStatus,
  responseCode,
  responseMessages,
} = require("../constants/responseConstants");

const responseData = (data) => (data && Object.keys(data).length ? data : null);
const responseBody = {
  success: (data = {}) => ({
    status: responseStatus.success,
    code: responseCode.success,
    message: data.message || responseMessages.success,
    data: responseData(data.data),
  }),
  badRequest: (data = {}) => ({
    status: responseStatus.badRequest,
    code: responseCode.badRequest,
    message: data.message || responseMessages.badRequest,
    data: responseData(data.data),
  }),

  recordNotFound: (data = {}) => ({
    status: responseStatus.recordNotFound,
    code: responseCode.recordNotFound,
    message: data.message || responseMessages.recordNotFound,
    route: data.routeMessage,
    data: responseData(data.data),
  }),
  conflict: (field, data = {}) => ({
    status: responseStatus.conflict,
    code: responseCode.conflict,
    message: data.message || responseMessages.conflict(field),
    data: responseData(data.data),
  }),
  validationError: (data = {}) => ({
    status: responseStatus.validationError,
    code: responseCode.validationError,
    message: data.message || responseMessages.validationError,
    errors: data.errors || {},
    data: responseData(data.data),
  }),
  unAuthorized: (data = {}) => ({
    status: responseStatus.unauthorized,
    code: responseCode.unAuthorized,
    message: data.message || responseMessages.unauthorized,
    data: responseData(data.data),
  }),
  forbidden: (data = {}) => ({
    status: responseStatus.forbidden,
    code: responseCode.forbidden,
    message: data.message || responseMessages.forbidden,
    data: responseData(data.data),
  }),
  internalServerError: (data = {}) => ({
    status: responseStatus.serverError,
    code: responseCode.internalServerError,
    message: data.message || responseMessages.internalServerError,
    stack: data.stack,
    data: responseData(data.data),
  }),
};

const responseHandler = (req, res, next) => {
  res.success = (data) => {
    res.status(responseCode.success).json(responseBody.success(data));
  };
  res.badRequest = (data) => {
    res.status(responseCode.badRequest).json(responseBody.badRequest(data));
  };
  res.internalServerError = (data) => {
    res
      .status(responseCode.internalServerError)
      .json(responseBody.internalServerError(data));
  };
  res.recordNotFound = (data) => {
    res
      .status(responseCode.recordNotFound)
      .json(responseBody.recordNotFound(data));
  };
  res.conflict = (data) => {
    res.status(responseCode.conflict).json(responseBody.conflict(data));
  };
  res.validationError = (data) => {
    res
      .status(responseCode.validationError)
      .json(responseBody.validationError(data));
  };
  res.unAuthorized = (data) => {
    res.status(responseCode.unAuthorized).json(responseBody.unAuthorized(data));
  };
  res.forbidden = (data) => {
    res.status(responseCode.forbidden).json(responseBody.forbidden(data));
  };
  next();
};
module.exports = responseHandler;

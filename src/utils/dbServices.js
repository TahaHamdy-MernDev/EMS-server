/**
 * Wraps an asynchronous function to handle errors automatically.
 * @param {Function} fn - The async function to wrap.
 * @returns {Function} A wrapped version of the input function.
 */
const handleAsync =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      return handleError(err);
    }
  };

/**
 * Handles errors by logging and rethrowing them.
 * @param {Error} err - The error to handle.
 * @throws {Error} Rethrows the error with a standardized message.
 */
const handleError = (err) => {
  console.error(`Error: ${err.message}`);
  throw new Error(`An unexpected error occurred: ${err.message}`);
};

/**
 * Creates a database service object with common CRUD operations.
 * @param {Object} model - The Mongoose model to operate on.
 * @returns {Object} An object with database operation methods.
 */
const dbService = (model) => ({
  /**
   * Creates a new document in the database.
   * @param {Object} data - The data to create the document with.
   * @returns {Promise<Object>} The created document.
   */
  create: handleAsync(async (data) => {
    return await model.create(data);
  }),

  /**
   * Updates a single document in the database.
   * @param {Object} filter - The filter to find the document to update.
   * @param {Object} data - The data to update the document with.
   * @param {Object} [options={ new: true }] - Options for the update operation.
   * @returns {Promise<Object>} The updated document.
   */
  updateOne: handleAsync(async (filter, data, options = { new: true }) => {
    return await model.findOneAndUpdate(filter, data, options);
  }),

  /**
   * Deletes a single document from the database.
   * @param {Object} filter - The filter to find the document to delete.
   * @param {Object} [options={ new: true }] - Options for the delete operation.
   * @returns {Promise<Object>} The deleted document.
   */
  deleteOne: handleAsync(async (filter, options = { new: true }) => {
    return await model.findOneAndDelete(filter, options);
  }),

  /**
   * Updates multiple documents in the database.
   * @param {Object} filter - The filter to find the documents to update.
   * @param {Object} data - The data to update the documents with.
   * @returns {Promise<number>} The number of documents modified.
   */
  updateMany: handleAsync(async (filter, data) => {
    const result = await model.updateMany(filter, data);
    return result.modifiedCount;
  }),

  /**
   * Deletes multiple documents from the database.
   * @param {Object} filter - The filter to find the documents to delete.
   * @returns {Promise<number>} The number of documents deleted.
   */
  deleteMany: handleAsync(async (filter) => {
    const result = await model.deleteMany(filter);
    return result.deletedCount;
  }),

  /**
   * Finds a single document in the database.
   * @param {Object} filter - The filter to find the document.
   * @param {Object} [options={}] - Options for the find operation.
   * @returns {Promise<Object>} The found document.
   */
  findOne: handleAsync(async (filter, options = {}) => {
    return await model.findOne(filter, options);
  }),

  /**
   * Finds multiple documents in the database.
   * @param {Object} filter - The filter to find the documents.
   * @param {Object} [options={}] - Options for the find operation.
   * @returns {Promise<Array<Object>>} An array of found documents.
   */
  findMany: handleAsync(async (filter, options = {}) => {
    const { sort = { createdAt: -1 }, ...restOptions } = options;
    return await model.find(filter, restOptions).sort(sort);
  }),

  /**
   * Counts the number of documents matching a filter.
   * @param {Object} filter - The filter to count documents.
   * @returns {Promise<number>} The count of matching documents.
   */
  count: handleAsync(async (filter) => {
    return await model.countDocuments(filter);
  }),

  /**
   * Paginates through documents in the database.
   * @param {Object} filter - The filter to find documents.
   * @param {Object} options - Pagination options.
   * @returns {Promise<Object>} Paginated result with documents and metadata.
   */
  paginate: handleAsync(async (filter, options) => {
    return await model.paginate(filter, options);
  }),
});

module.exports = dbService;

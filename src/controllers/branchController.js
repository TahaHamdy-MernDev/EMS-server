const asyncHandler = require("../handlers/asyncHandler");
const branchServices = require("../utils/dbServices")(
  require("../models/branchModel")
);
exports.createBranch = asyncHandler(async (req, res) => {
  const branch = await branchServices.findOne({ name: req.body.name });
  if (branch) {
    return res.badRequest({ message: "branch name already in use...!" });
  }
  const newBranch = await branchServices.create({ ...req.body });
  return res.success({ data: newBranch });
});
exports.getBranch = asyncHandler(async (req, res) => {
  const branch = await branchServices.findOne({ slug: req.params.slug });
  if (!branch) {
    return res.recordNotFound({ message: "branch not found...!" });
  }
  return res.success({ data: branch });
});
exports.getAllBranches = asyncHandler(async (req, res) => {
  const branches = await branchServices.findMany({});
  return res.success({ data: branches });
});
exports.updateBranch = asyncHandler(async (req, res) => {
  const updatedBranch = await branchServices.updateOne(
    { slug: req.params.slug },
    req.body
  );
  if (!updatedBranch) {
    return res.recordNotFound({ message: "Branch not found..." });
  }
  return res.success({ data: updatedBranch });
});
exports.deleteBranch = asyncHandler(async (req, res) => {
  const deletedBranch = await branchServices.deleteOne({
    slug: req.params.slug,
  });
  if (!deletedBranch) {
    return res.recordNotFound({ message: "Branch not found..." });
  }
  return res.success({
    message: "Branch deleted successfully",
  });
});

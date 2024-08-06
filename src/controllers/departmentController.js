const asyncHandler = require("../handlers/asyncHandler");
const departmentServices = require("../utils/dbServices")(
  require("../models/departmentModel")
);
exports.createDepartment = asyncHandler(async (req, res) => {
  const department = await departmentServices.findOne({ name: req.body.name });
  if (department) {
    return res.badRequest({ message: "department name already in use...!" });
  }
  const newDepartment = await departmentServices.create({ ...req.body });
  return res.success({ data: newDepartment });
});
exports.getDepartment = asyncHandler(async (req, res) => {
  const department = await departmentServices.findOne({
    slug: req.params.slug,
  });
  if (!department) {
    return res.recordNotFound({ message: "department not found...!" });
  }
  return res.success({ data: department });
});
exports.getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await departmentServices.findMany({});
  return res.success({ data: departments });
});
exports.updateDepartment = asyncHandler(async (req, res) => {
  const updatedDepartment = await departmentServices.updateOne(
    { slug: req.params.slug },
    req.body
  );
  if (!updatedDepartment) {
    return res.recordNotFound({ message: "department not found..." });
  }
  return res.success({ data: updatedDepartment });
});
exports.deleteDepartment = asyncHandler(async (req, res) => {
  const deletedDepartment = await departmentServices.deleteOne({
    slug: req.params.slug,
  });
  if (!deletedDepartment) {
    return res.recordNotFound({ message: "department not found..." });
  }
  return res.success({
    message: "department deleted successfully",
  });
});

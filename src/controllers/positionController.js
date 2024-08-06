const asyncHandler = require("../handlers/asyncHandler");
const positionServices = require("../utils/dbServices")(
  require("../models/positionModel")
);
exports.createPosition = asyncHandler(async (req, res) => {
  const Position = await positionServices.findOne({ name: req.body.name });
  if (Position) {
    return res.badRequest({ message: "Position name already in use...!" });
  }
  const newPosition = await positionServices.create({ ...req.body });
  return res.success({ data: newPosition });
});
exports.getPosition = asyncHandler(async (req, res) => {
  const Position = await positionServices.findOne({ slug: req.params.slug });
  if (!Position) {
    return res.recordNotFound({ message: "Position not found...!" });
  }
  return res.success({ data: Position });
});
exports.getAllPositions = asyncHandler(async (req, res) => {
  const Positions = await positionServices.findMany({});
  return res.success({ data: Positions });
});
exports.updatePosition = asyncHandler(async (req, res) => {
  const updatedPosition = await positionServices.updateOne(
    { slug: req.params.slug },
    req.body
  );
  if (!updatedPosition) {
    return res.recordNotFound({ message: "Position not found..." });
  }
  return res.success({ data: updatedPosition });
});
exports.deletePosition = asyncHandler(async (req, res) => {
  const deletedPosition = await positionServices.deleteOne({
    slug: req.params.slug,
  });
  if (!deletedPosition) {
    return res.recordNotFound({ message: "Position not found..." });
  }
  return res.success({
    message: "Position deleted successfully",
  });
});

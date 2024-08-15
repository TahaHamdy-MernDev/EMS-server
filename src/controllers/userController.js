const asyncHandler = require("../handlers/asyncHandler");
const { userServices } = require("../models/userModel");
exports.createUser = asyncHandler(async (req, res) => {
  const existingUser = await userServices.findOne({
    $or: [{ phone: req.body.phone }, { email: req.body.email }],
  });

  if (existingUser) {
    return res.conflict({
      message:
        existingUser.phone === req.body.phone
          ? "Phone number already in use"
          : "Email address already in use",
    });
  }

  const newUser = await userServices.create(req.body);
  return res.created({ data: newUser, message: "User created successfully" });
});
exports.banUser = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const updatedUser = await userServices.updateOne({ slug }, { banned: true });

  if (!updatedUser) {
    return res.notFound({ message: "User not found" });
  }

  return res.success({
    data: updatedUser,
    message: "User banned successfully",
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const user = await userServices.findOne({ slug });

  if (!user) {
    return res.notFound({ message: "User not found" });
  }

  return res.success({ data: user });
});
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort
  };
  
  const users = await userServices.findMany({}, options);
  return res.success({ data: users });
});
exports.updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userServices.updateOne(
    { slug: req.params.slug },
    req.body
  );
  if (!updatedUser) {
    return res.recordNotFound({ message: "User not found..." });
  }
  return res.success({ data: updatedUser });
});
exports.deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await userServices.deleteOne({
    slug: req.params.slug,
  });
  if (!deletedUser) {
    return res.recordNotFound({ message: "User not found..." });
  }
  return res.success({
    message: "User deleted successfully",
  });
});

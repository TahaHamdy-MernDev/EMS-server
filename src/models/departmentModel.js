const mongoose = require("mongoose");
const slugify = require("../utils/slugify");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    length: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
departmentSchema.pre("validate", function (next) {
  if (this.isNew || this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;

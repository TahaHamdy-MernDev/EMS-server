const mongoose = require("mongoose");
const brachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    length: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
brachSchema.pre("validate", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});
const BranchModel = mongoose.model("Branch", brachSchema);
module.exports = BranchModel;

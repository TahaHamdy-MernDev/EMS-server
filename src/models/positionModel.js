const mongoose = require("mongoose");
const slugify = require("../utils/slugify");

const positionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    length: { type: Number, default: 0 },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

positionSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;

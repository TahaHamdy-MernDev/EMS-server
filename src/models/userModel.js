const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserRole, Gender } = require("../config/enums");
const slugify = require("../utils/slugify");

const generateUniqueNumber = () => {
  const timestampPart = Date.now().toString().slice(-4);
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  return (parseInt(timestampPart + randomPart) % 1000000)
    .toString()
    .padStart(6, "0");
};

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    banned: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.EMPLOYEE,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    gender: { type: String, enum: Object.values(Gender) },
    slug: { type: String, required: true, unique: true },
    uniqueNumber: { type: String, required: true, unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    position: { type: mongoose.Schema.Types.ObjectId, ref: "Position" },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  },
  { timestamps: true }
);

Object.assign(userSchema.statics, { UserRole, Gender });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const createUserSlug = (firstName, lastName, uniqueNumber) => {
  const slugBase = `${firstName} ${lastName} ${uniqueNumber}`;
  return slugify(slugBase);
};
userSchema.pre("validate", function (next) {
  if (this.isNew) {
    this.uniqueNumber = generateUniqueNumber();
    this.slug = createUserSlug(
      this.firstName,
      this.lastName,
      this.uniqueNumber
    );
  } else if (this.isModified("firstName") || this.isModified("lastName")) {
    this.slug = createUserSlug(
      this.firstName,
      this.lastName,
      this.uniqueNumber
    );
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

userSchema.method("toJSON", function () {
  const { _id, __v, ...object } = this.toObject({ virtuals: true });
  delete object.password;
  object.id = _id;
  return object;
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

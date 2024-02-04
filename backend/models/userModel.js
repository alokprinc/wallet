const { mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  firstName: {
    required: true,
    type: String,
    minLength: 3,
    maxLength: 30,
    trim: true,
  },
  lastName: {
    required: true,
    type: String,
    minLength: 3,
    maxLength: 30,
    trim: true,
  },
  password: { required: true, type: String, minLength: 8 },
});

// hashing password (Encryption)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
});
UserSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    try {
      const hashedPassword = await bcrypt.hash(
        this._update.password,
        SALT_WORK_FACTOR
      );
      this._update.password = hashedPassword;
      return next();
    } catch (error) {
      return next(error);
    }
  }
  return next();
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
UserSchema.methods.generateToken = async function () {
  return jwt.sign({ userId: this._id }, JWT_SECRET);
};
const User = mongoose.model("User", UserSchema);
module.exports = { User };

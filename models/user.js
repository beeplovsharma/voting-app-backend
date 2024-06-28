import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  aadhaarCard: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// Encrypting Password Before any Changes in it
userSchema.pre("save", async function (next) {
  const user = this;
  // Hash the password only if it has been modified (or is new)
  if (!user.isModified("password")) return next();
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(user.password, salt);
    // Override the plain password with the hashed one
    user.password = hashedPassword;
    console.log("Password is Encrypted");
    next();
  } catch (error) {
    console.log("Error in hashing password");
    return next(error);
  }
});

// Comparing Password
userSchema.methods.comparePassword = async function (candidatePassword){
  try {
    const isValid = await bcrypt.compare(candidatePassword, this.password);
    return isValid;
  } catch (error) {
    throw new error;
  }
}

const User = mongoose.model("User", userSchema);
export default User;

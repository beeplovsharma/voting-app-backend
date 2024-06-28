import mongoose from "mongoose";

const aadhaarSchema = new mongoose.Schema(
  {
    aadhaarCard: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Aadhaar = mongoose.model("Aadhaar", aadhaarSchema);
export default Aadhaar;

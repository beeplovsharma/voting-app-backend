import Aadhaar from "./../models/aadhaar.js";
export const checkAadhaar = async (aadhaarNumber) => {
  try {
    const isValid = await Aadhaar.findOne({ aadhaarCard: aadhaarNumber });
    if (isValid) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new error;
  }
};

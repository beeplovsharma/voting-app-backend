import User from "./../models/user.js";
export const checkAdminRole = async (aadhaarNumber) => {
  try {
    const user = await User.findOne({ aadhaarCard: aadhaarNumber });
    const role = user.role;
    if (role === "admin") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new error();
  }
};

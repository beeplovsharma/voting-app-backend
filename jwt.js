import jwt from "jsonwebtoken";
import "dotenv/config";

export const jwtAuth = (req, res, next) => {
  // Extract JWT token from the request header authorization
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(403).json({ error: "Token Not Found !" });
  }

  try {
    // Verifying the JWT Tokwn
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attaching the decoded token (User Inforrmation) to the request object
    req.decodedData = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Invalid Token" });
  }
};

// Function for generating a JWT token
export const generateToken = (userData) => {
  // Generating JWT using user data
  return jwt.sign({ data: userData }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
};

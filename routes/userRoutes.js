import { Router } from "express";
import User from "./../models/user.js";
import Aadhaar from "./../models/aadhaar.js"
import { jwtAuth, generateToken } from "../jwt.js";
const router = Router();

// Signup Person
router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // Assuming the request body contains the person data
    // Checking Aadhaar Number in our database
    const isValidUser = await Aadhaar.findOne({ aadhaarCard:data.aadhaarCard });
    if (!isValidUser) return res.status(404).send({ error: "Invalid Aadhaar Number !" });

    const newUser = new User(data);
    const savedUser = await newUser.save();
    // Payload for JWT
    const payload = {
      id: savedUser.id,
      username: savedUser.aadhaarCard,
    };
    // Generating Token After Signup Success
    const token = generateToken(payload);
    console.log("Token Gen : ", token);
    res.status(200).send({ response: savedUser, token: token });
  } catch (error) {
    console.log("Failed to save new user data");
    res.status(500).send(error);
  }
});

// Login person
router.post("/login", async (req, res) => {
  try {
    const { aadhaarCard, password } = req.body;
    // Checking Username
    const user = await User.findOne({ aadhaarCard: aadhaarCard });
    if (!user) return res.status(401).send({ error: "User Not Found" });
    // Checking Password
    const validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res.status(401).send({ error: "Invalid password" });
    // Payload for JWT
    const payload = {
      id: user.id,
      username: user.aadhaarCard,
    };
    // Generating Token After Signup Success
    const token = generateToken(payload);
    res.status(200).send({ token: token });
  } catch (error) {
    console.log("Login Failed", error);
    return res.status(501).send({ message: "Login Failed", error });
  }
});

// Profile
router.get("/profile", jwtAuth, async (req, res) => {
  try {
    const userData = req.decodedData;
    const aadhaarCard = userData.data.username;
    const profileData = await Aadhaar.findOne({aadhaarCard: aadhaarCard});
    res.status(201).send({profileData});
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;

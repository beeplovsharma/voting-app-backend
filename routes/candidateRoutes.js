import { Router } from "express";
import Candidate from "./../models/candidate.js";
import User from "./../models/user.js";
import { jwtAuth, generateToken } from "../jwt.js";
import { checkAdminRole } from "../helpers/checkAdmin.js";
import { checkAadhaar } from "../helpers/checkAadhaar.js";
const router = Router();

// List of Candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).send({ candidates });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", error });
  }
});

// Add a Candidate ~ Admin
router.post("/", jwtAuth, async (req, res) => {
  try {
    const userData = req.decodedData;
    console.log(userData);
    const aadhaarNumber = userData.data.username;
    const isAdmin = await checkAdminRole(aadhaarNumber);
    if (!isAdmin) return res.send({ error: "You're not an admin !" });

    const candidate = req.body;
    console.log(candidate);
    const isValidAadhaar = await checkAadhaar(candidate.aadhaarCard);
    if (!isValidAadhaar)
      return res.send({ error: "Your Aadhaar isn't available in our DB !" });
    const newCandidate = new Candidate(candidate);
    const savedCandidate = await newCandidate.save();
    console.log("Candidate Saved Successfully !");
    res.status(201).send({ savedCandidate });
  } catch (error) {
    console.log("Error in saving candidate!", error);
    res.status(500).send({ error: "Internal Server Error", error });
  }
});

// Delete a Candidate ~ Admin
router.delete("/:aadhaar", jwtAuth, async (req, res) => {
  try {
    const userData = req.decodedData;
    const isAdmin = await checkAdminRole(userData.data.username);
    if (!isAdmin) {
      return res.send({ error: "You're not an admin!" });
    }
    const aadhaar = req.params.aadhaar;
    const isValidAadhaar = await checkAadhaar(aadhaar);
    if (!isValidAadhaar) {
      return res.send({ error: "Your Aadhaar isn't available in our DB!" });
    }
    const deletedCandidate = await Candidate.findOneAndDelete({
      aadhaarCard: aadhaar,
    });
    res.status(200).send({ deletedCandidate });
    console.log("Candidate Deleted Successfully!");
  } catch (error) {
    res.send(error);
  }
});

// Update a Candidate ~ Admin
router.put("/:aadhaar", jwtAuth, async (req, res) => {
  try {
    const userData = req.decodedData;
    const isAdmin = await checkAdminRole(userData.data.username);
    if (!isAdmin) {
      return res.send({ error: "You're not an admin!" });
    }
    const aadhaar = req.params.aadhaar;
    const isValidAadhaar = await checkAadhaar(aadhaar);
    if (!isValidAadhaar) {
      return res.send({ error: "Your Aadhaar isn't available in our DB!" });
    }
    const newData = req.body;
    // Checking AadhaarCard of New Data
    const updatedCandidate = await Candidate.findOneAndUpdate(
      { aadhaarCard: aadhaar },
      { party: newData.party }
    );
    if (!updatedCandidate) {
      return res.send({ error: "Candidate not found!" });
    }
    const savedCandidate = await updatedCandidate.save();
    res.status(200).send({ savedCandidate });
  } catch (error) {}
});

export default router;

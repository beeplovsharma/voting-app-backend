import { Router } from "express";
import Phase from "./../models/phase.js";

const router = Router();
router.get("/", async (req, res) => {
  try {
    const currentPhase = await Phase.find();
    res.status(200).send({ currentPhase });
  } catch (error) {
    res.status(500).send({ error: "Server Error", error });
  }
});

export default router;

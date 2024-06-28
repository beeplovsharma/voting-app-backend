import express from "express";
import Aadhaar from "./models/aadhaar.js";
import "dotenv/config";
import bodyParser from "body-parser";
import db from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import phaseRoutes from "./routes/phaseRoutes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Connecting to DB
db();

app.use(bodyParser.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to Voting API");
});

app.post("/aadhaar", async (req, res) => {
  try {
    const user = req.body;
    const newUser = new Aadhaar(user);
    const savedUser = await newUser.save();
    console.log("New Aadhaar Details Saved");
    res.status(201).send({ savedUser });
  } catch (error) {
    console.log(error);
    res.status(501).send({ message: "Error in adding new aadhaar details" });
  }
});

// Importing Routes
app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);
app.use("/phase", phaseRoutes);

app.listen(PORT, () => {
  console.log(`Server Listening on ${PORT}`);
});

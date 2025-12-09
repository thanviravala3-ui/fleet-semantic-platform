require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const jobsRouter = require("./routes/jobs");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// simple login to get a JWT
app.post("/api/login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "email required" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "1h"
  });

  res.json({ token });
});

app.use("/api/jobs", jobsRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

import express from "express";
import cors from "cors";
import { analyzeMessage, scanUrl, checkPhone } from "../src/shared/index.ts";

const app = express();
app.use(cors());
app.use(express.json());

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.post("/analyze", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "A valid 'text' string is required" });
  }
  try {
    const result = analyzeMessage(text);
    res.json(result);
  } catch (err) {
    console.error("Analysis failure", err);
    res.status(500).json({ error: "Failed to analyze message" });
  }
});

app.post("/scan", (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid 'url' string is required" });
  }
  try {
    const result = scanUrl(url);
    res.json(result);
  } catch (err) {
    console.error("Scan failure", err);
    res.status(500).json({ error: "Failed to scan URL" });
  }
});

app.post("/check-phone", (req, res) => {
  const { number } = req.body;
  if (!number || typeof number !== "string") {
    return res.status(400).json({ error: "A valid 'number' string is required" });
  }
  try {
    const result = checkPhone(number);
    res.json(result);
  } catch (err) {
    console.error("Phone check failure", err);
    res.status(500).json({ error: "Failed to check phone number" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 CyberGuard Threat API listening on http://localhost:${port}`);
});

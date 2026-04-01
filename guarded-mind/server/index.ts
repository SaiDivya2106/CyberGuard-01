import express from "express";
import cors from "cors";
import { analyzeMessage, scanUrl } from "../src/shared/index.ts";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", (req, res) => {
  const { text } = req.body;
  if (typeof text !== "string") {
    return res.status(400).json({ error: "text must be a string" });
  }
  const result = analyzeMessage(text);
  res.json(result);
});

app.post("/scan", (req, res) => {
  const { url } = req.body;
  if (typeof url !== "string") {
    return res.status(400).json({ error: "url must be a string" });
  }
  try {
    const result = scanUrl(url);
    res.json(result);
  } catch (err) {
    console.error("scan error", err);
    res.status(500).json({ error: "internal" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Threat analysis API listening on http://localhost:${port}`);
});

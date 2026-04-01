import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";

// because our server is small, we can import it by building an app instance
import { analyzeMessage, scanUrl } from "../shared";

// replicate the express setup from server/index.ts
function createApp() {
  const app = express();
  app.use(express.json());
  app.post("/analyze", (req, res) => {
    const { text } = req.body;
    if (typeof text !== "string") return res.status(400).json({ error: "text must be a string" });
    return res.json(analyzeMessage(text));
  });
  app.post("/scan", (req, res) => {
    const { url } = req.body;
    if (typeof url !== "string") return res.status(400).json({ error: "url must be a string" });
    return res.json(scanUrl(url));
  });
  return app;
}

describe("backend API", () => {
  const app = createApp();

  it("should analyze text", async () => {
    const res = await request(app).post("/analyze").send({ text: "Free money" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("riskScore");
  });

  it("should scan URL", async () => {
    const res = await request(app).post("/scan").send({ url: "http://example.com" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("classification");
  });
});
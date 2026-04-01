// shared/index.ts
// Central exports for analysis logic so it can be reused by web, mobile and server.

export * from "../lib/datasetUtils.ts";
import { isUrlKnownMalicious } from "../lib/datasetUtils.ts";

// only type imports are needed for the interfaces; they are erased at runtime
import type { SmsEntry, UrlEntry } from "../lib/datasetUtils.ts";

const phishingKeywords = [
  "verify", "account", "suspended", "urgent", "click here", "password",
  "expire", "confirm", "login", "bank", "wire transfer", "social security",
  "won", "prize", "congratulations", "act now", "limited time", "free",
  "update your", "unusual activity", "compromised", "security alert",
];

export interface AnalysisResult {
  riskScore: number;
  classification: string;
  threats: string[];
  extractedUrls: string[];
  keywords: string[];
  spamProbability?: number;
}

export interface ScanResult {
  url: string;
  riskScore: number;
  classification: string;
  details: { label: string; value: string; status: "safe" | "warning" | "danger" }[];
}

import { buildSmsClassifier } from "../lib/datasetUtils.ts";
const smsClassifier = buildSmsClassifier();

export function analyzeMessage(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  const foundKeywords = phishingKeywords.filter(k => lower.includes(k));
  const urlRegex = new RegExp('https?:\\/\\/[^\\s]+', 'gi'); // match any non‑whitespace sequence
  const extractedUrls = text.match(urlRegex) || [];
  const suspiciousUrlPatterns = extractedUrls.filter(
    u => /[0-9]{1,3}\.[0-9]{1,3}/.test(u) || u.includes("login") || u.includes("verify") || u.includes("secure") || u.length > 60
  );

  const threats: string[] = [];
  let score = 0;

  if (foundKeywords.length > 0) {
    score += Math.min(foundKeywords.length * 12, 40);
    threats.push(`${foundKeywords.length} phishing keyword(s) detected`);
  }
  if (extractedUrls.length > 0) {
    score += 15;
    threats.push(`${extractedUrls.length} URL(s) found in message`);
  }
  if (suspiciousUrlPatterns.length > 0) {
    score += 25;
    threats.push(`${suspiciousUrlPatterns.length} suspicious URL pattern(s)`);
  }
  if (lower.includes("!") && (lower.match(/!/g) || []).length > 2) {
    score += 10;
    threats.push("Excessive urgency markers");
  }
  if (text.length > 20 && text === text.toUpperCase()) {
    score += 10;
    threats.push("All caps text detected");
  }

  const spamProb = smsClassifier.spamProbability(text);
  if (spamProb > 0.5) {
    const bump = Math.round((spamProb - 0.5) * 100);
    score = Math.min(100, score + bump);
    threats.push(`Dataset classifier predicts spam (${(spamProb * 100).toFixed(1)}%)`);
  }

  score = Math.min(score, 100);
  const classification = score <= 30 ? "Safe" : score <= 70 ? "Suspicious" : "Dangerous";

  return { riskScore: score, classification, threats, extractedUrls, keywords: foundKeywords, spamProbability: spamProb };
}

export function scanUrl(url: string) {
  try {
    // duplicate logic from LinkScanner but simpler; reuse dataset helpers
    const details: { label: string; value: string; status: "safe" | "warning" | "danger" }[] = [];
    let score = 0;
    try {
      const u = new URL(url);
      const domain = u.hostname;
      if (/[0-9]{1,3}(?:\.[0-9]{1,3}){3}/.test(domain)) {
        score += 30;
        details.push({ label: "Domain Type", value: "IP address (suspicious)", status: "danger" });
      } else if (domain.split(".").length > 3) {
        score += 20;
        details.push({ label: "Domain Type", value: "Excessive subdomains", status: "warning" });
      } else {
        details.push({ label: "Domain Type", value: domain, status: "safe" });
      }
      if (u.protocol !== "https:") {
        score += 20;
        details.push({ label: "Protocol", value: "HTTP (insecure)", status: "danger" });
      } else {
        details.push({ label: "Protocol", value: "HTTPS (secure)", status: "safe" });
      }
      if (url.length > 100) {
        score += 15;
        details.push({ label: "URL Length", value: `${url.length} chars (unusually long)`, status: "warning" });
      } else {
        details.push({ label: "URL Length", value: `${url.length} chars`, status: "safe" });
      }
      const suspiciousWords = ["login", "verify", "secure", "account", "update", "confirm", "paypal", "bank"];
      const found = suspiciousWords.filter(w => url.toLowerCase().includes(w));
      if (found.length > 0) {
        score += found.length * 10;
        details.push({ label: "Suspicious Keywords", value: found.join(", "), status: "danger" });
      }
      if (/[0-9]/.test(domain.replace(/\./g, "").slice(0, -3)) && /[a-z]/.test(domain)) {
        score += 10;
        details.push({ label: "Domain Pattern", value: "Mixed alphanumeric", status: "warning" });
      }
    } catch (e) {
      score = 50;
      details.push({ label: "URL Parsing", value: "Invalid URL format", status: "danger" });
    }
    if (isUrlKnownMalicious(url)) {
      score = 100;
      details.push({ label: "Dataset Lookup", value: "Known malicious URL", status: "danger" });
    }
    score = Math.min(score, 100);
    const classification = score <= 30 ? "Safe" : score <= 70 ? "Suspicious" : "Dangerous";
    return { url, riskScore: score, classification, details };
  } catch (fatal) {
    console.error("scanUrl fatal error", fatal);
    return { url, riskScore: 0, classification: "Safe", details: [] };
  }
}

export interface PhoneResult {
  number: string;
  riskScore: number;
  reports: number;
  type: string;
  carrier: string;
  location: string;
  recentActivity: string[];
}

export function checkPhone(number: string): PhoneResult {
  // Simulated analysis based on number hash for consistency
  const hash = number.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const riskScore = ((hash * 17) % 100);
  const reports = (hash % 15);
  const types = ["Mobile", "Landline", "VoIP", "Toll-Free"];
  const carriers = ["AT&T", "Verizon", "T-Mobile", "Unknown"];
  const locations = ["New York, US", "London, UK", "Unknown", "Lagos, NG", "Mumbai, IN"];
  const activities = [
    "Reported as IRS scam caller",
    "Multiple spam call reports",
    "Flagged for phishing SMS",
    "Community report: tech support scam",
    "No suspicious activity reported",
  ];

  return {
    number,
    riskScore,
    reports,
    type: types[hash % types.length],
    carrier: carriers[hash % carriers.length],
    location: locations[hash % locations.length],
    recentActivity: riskScore > 30
      ? activities.slice(0, Math.min(3, 1 + (hash % 3)))
      : [activities[4]],
  };
}

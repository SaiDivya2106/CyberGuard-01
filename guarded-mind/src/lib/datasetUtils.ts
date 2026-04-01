// Utilities for working with the static datasets that ship with the project.
// In the browser we rely on Vite's "?raw" loader so the files are bundled as
// strings. When running under Node (ts-node/Express server) the loader is
// unavailable, so we fall back to reading the files from disk. The try/catch
// below handles both scenarios transparently.

let smsRaw: string;
let urlRaw: string;
let fraudRaw: string;

// Use top-level await to synchronously initialize the raw strings before any
// parsing logic executes. Browser bundlers (Vite/Vitest) will load
// datasetRaw.ts, which contains `?raw` imports. Node/ts-node will take the
// alternative branch and read files directly from disk.
if (typeof window === "undefined") {
  // Node environment (ES module) – compute directory from import.meta.url
  const fs = (await import("fs")).default;
  const path = (await import("path")).default;
  const { fileURLToPath } = await import("url");
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const base = path.resolve(__dirname, "../../datasets");
  smsRaw = fs.readFileSync(path.join(base, "SMSSpamCollection"), "utf-8");
  urlRaw = fs.readFileSync(path.join(base, "Malicious_URLs.csv"), "utf-8");
  fraudRaw = fs.readFileSync(path.join(base, "fraud_call.file"), "utf-8");
} else {
  // Browser/bundler environment
  const { smsRaw: s, urlRaw: u, fraudRaw: f } = await import("./datasetRaw.ts");
  smsRaw = s;
  urlRaw = u;
  fraudRaw = f;
}

export interface SmsEntry {
  label: "ham" | "spam";
  text: string;
}

export interface UrlEntry {
  url: string;
  label: "good" | "bad";
}

export interface FraudEntry {
  label: "fraud" | "normal";
  text: string;
}

// parse SMS dataset (tab separated)
export const smsDataset: SmsEntry[] = smsRaw
  .trim()
  .split("\n")
  .map((line) => {
    const [label = "", ...rest] = line.split("\t");
    return { label: label.trim() as "ham" | "spam", text: rest.join("\t").trim() };
  })
  .filter((s) => s.text);

// parse URL dataset (csv with header)
export const urlDataset: UrlEntry[] = urlRaw
  .trim()
  .split("\n")
  .slice(1) // drop header
  .map((line) => {
    const [u = "", cls = ""] = line.split(",");
    return { url: u.trim(), label: cls.trim() as "good" | "bad" };
  });

// parse fraud call dataset (tab separated)
export const fraudDataset: FraudEntry[] = fraudRaw
  .trim()
  .split("\n")
  .map((line) => {
    const [label = "", ...rest] = line.split("\t");
    return { label: label.trim() as "fraud" | "normal", text: rest.join("\t").trim() };
  })
  .filter((f) => f.text);

// Combine sms and fraud datasets for training; treat fraud messages as spam
const combinedSms: SmsEntry[] = [
  ...smsDataset,
  ...fraudDataset.map((f) => ({ label: f.label === "fraud" ? "spam" : "ham", text: f.text })),
];

// build a simple naive Bayes style classifier from the combined dataset
interface Classifier {
  classify: (text: string) => "ham" | "spam";
  spamProbability: (text: string) => number;
}

let classifierCache: Classifier | null = null;

export function buildSmsClassifier(): Classifier {
  if (classifierCache) return classifierCache;

  const wordCounts: Record<"spam" | "ham", Record<string, number>> = {
    spam: {},
    ham: {},
  };
  let spamTotal = 0;
  let hamTotal = 0;

  combinedSms.forEach((entry) => {
    const tokens = entry.text
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean);
    if (entry.label === "spam") spamTotal++; else hamTotal++;
    tokens.forEach((w) => {
      wordCounts[entry.label][w] = (wordCounts[entry.label][w] || 0) + 1;
    });
  });

  const classify = (text: string) => {
    const prob = spamProbability(text);
    return prob > 0.5 ? "spam" : "ham";
  };

  const spamProbability = (text: string) => {
    const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
    // start with prior probability P(spam)
    let logSpam = Math.log(spamTotal / (spamTotal + hamTotal));
    let logHam = Math.log(hamTotal / (spamTotal + hamTotal));
    tokens.forEach((w) => {
      const spamFreq = (wordCounts.spam[w] || 1);
      const hamFreq = (wordCounts.ham[w] || 1);
      logSpam += Math.log(spamFreq / (spamTotal + Object.keys(wordCounts.spam).length));
      logHam += Math.log(hamFreq / (hamTotal + Object.keys(wordCounts.ham).length));
    });
    const spamExp = Math.exp(logSpam);
    const hamExp = Math.exp(logHam);
    return spamExp / (spamExp + hamExp);
  };

  classifierCache = { classify, spamProbability };
  return classifierCache;
}

// quick lookup set for malicious urls
let maliciousSet: Set<string> | null = null;

function buildUrlSet() {
  if (maliciousSet) return maliciousSet;
  maliciousSet = new Set(
    urlDataset.filter((u) => u.label === "bad").map((u) => u.url.toLowerCase())
  );
  return maliciousSet;
}

/**
 * Checks whether a given URL string is present (or resembles) a known malicious entry
 * from the dataset. Matching is done by exact substring of the url dataset entry.
 */
export function isUrlKnownMalicious(testUrl: string): boolean {
  const set = buildUrlSet();
  const lower = testUrl.toLowerCase();
  for (const bad of set) {
    if (lower.includes(bad)) return true;
  }
  return false;
}

// simple helper to sample data
export function sampleSms(n = 10): SmsEntry[] {
  return smsDataset.slice(0, n);
}

export function sampleUrls(n = 10): UrlEntry[] {
  return urlDataset.slice(0, n);
}

export function sampleFraud(n = 10): FraudEntry[] {
  return fraudDataset.slice(0, n);
}

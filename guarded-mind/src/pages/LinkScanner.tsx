import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Scan, Globe, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RiskScoreCircle from "@/components/RiskScoreCircle";
import RiskBadge from "@/components/RiskBadge";
import { useThreatAlert } from "@/components/ThreatAlertProvider";

import { scanUrl as sharedScan } from "../shared";

interface ScanResult {
  url: string;
  riskScore: number;
  classification: string;
  details: { label: string; value: string; status: "safe" | "warning" | "danger" }[];
}

const scanUrl = (url: string): ScanResult => sharedScan(url);

const scanUrl = (url: string): ScanResult => {
  const details: ScanResult["details"] = [];
  let score = 0;

  // Domain analysis
  try {
    const u = new URL(url);
    const domain = u.hostname;

    if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(domain)) {
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
  } catch {
    score = 50;
    details.push({ label: "URL Parsing", value: "Invalid URL format", status: "danger" });
  }

  // dataset check: if we already know this URL or a substring of it is bad, bump risk
  if (isUrlKnownMalicious(url)) {
    score = 100;
    details.push({ label: "Dataset Lookup", value: "Known malicious URL", status: "danger" });
  }

  score = Math.min(score, 100);
  const classification = score <= 30 ? "Safe" : score <= 70 ? "Suspicious" : "Dangerous";

  return { url, riskScore: score, classification, details };
};

const statusIcon = (s: "safe" | "warning" | "danger") => {
  if (s === "safe") return <ShieldCheck className="h-4 w-4 text-success" />;
  if (s === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />;
  return <ShieldAlert className="h-4 w-4 text-destructive" />;
};

const LinkScanner = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { triggerAlert } = useThreatAlert();

  const handleScan = () => {
    if (!url.trim()) return;
    setIsScanning(true);
    setResult(null);
    setTimeout(() => {
      const scanResult = scanUrl(url);
      setResult(scanResult);
      setIsScanning(false);
      triggerAlert({
        type: "malicious_link",
        content: url,
        riskScore: scanResult.riskScore,
        recommendedAction: "Do not visit this URL. It may attempt to steal your credentials or install malware.",
      });
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Link Scanner</h1>
        <p className="mt-1 text-sm text-muted-foreground">Analyze URLs for malicious content, phishing patterns, and domain reputation.</p>
      </div>

      <div className="card-shadow rounded-xl bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Enter URL</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/suspicious-link"
              className="pl-10 bg-input"
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
            />
          </div>
          <Button onClick={handleScan} disabled={!url.trim() || isScanning}>
            {isScanning ? <Scan className="mr-2 h-4 w-4 animate-spin" /> : <Scan className="mr-2 h-4 w-4" />}
            Scan
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-6 lg:grid-cols-3">
            <div className="card-shadow rounded-xl bg-card p-6 flex flex-col items-center justify-center">
              <RiskScoreCircle score={result.riskScore} size={140} />
              <div className="mt-4">
                <RiskBadge score={result.riskScore} />
              </div>
            </div>
            <div className="card-shadow rounded-xl bg-card p-6 lg:col-span-2">
              <h2 className="text-base font-semibold tracking-tight mb-1">Scan Details</h2>
              <p className="font-mono text-xs text-muted-foreground mb-4 truncate">{result.url}</p>
              <div className="space-y-3">
                {result.details.map((d, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div className="flex items-center gap-3">
                      {statusIcon(d.status)}
                      <span className="text-sm font-medium">{d.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LinkScanner;

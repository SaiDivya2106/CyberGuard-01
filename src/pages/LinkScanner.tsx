import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Scan, Globe, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RiskScoreCircle from "@/components/RiskScoreCircle";
import RiskBadge from "@/components/RiskBadge";
import { useThreatAlert } from "@/components/ThreatAlertProvider";

import { scanUrl as sharedScan, type ScanResult } from "../shared";

const scanUrl = sharedScan;

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

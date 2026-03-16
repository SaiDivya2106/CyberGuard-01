import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareWarning, Scan, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import RiskScoreCircle from "@/components/RiskScoreCircle";
import RiskBadge from "@/components/RiskBadge";
import { useThreatAlert } from "@/components/ThreatAlertProvider";
import { analyzeMessage } from "../shared"; // shared analyzer


interface AnalysisResult {
  riskScore: number;
  classification: string;
  threats: string[];
  extractedUrls: string[];
  keywords: string[];
  // probability from the dataset-based classifier (0‑1)
  spamProbability?: number;
}

const phishingKeywords = [
  "verify", "account", "suspended", "urgent", "click here", "password",
  "expire", "confirm", "login", "bank", "wire transfer", "social security",
  "won", "prize", "congratulations", "act now", "limited time", "free",
  "update your", "unusual activity", "compromised", "security alert",
];

const analyzeMessage = (text: string): AnalysisResult => {
  const lower = text.toLowerCase();
  const foundKeywords = phishingKeywords.filter(k => lower.includes(k));
  const urlRegex = /https?:\/\/[^\s]+/gi;
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

  // run dataset classifier and nudge the score if it thinks the text is spam
  const spamProb = smsClassifier.spamProbability(text);
  if (spamProb > 0.5) {
    const bump = Math.round((spamProb - 0.5) * 100);
    score = Math.min(100, score + bump);
    threats.push(`Dataset classifier predicts spam (${(spamProb * 100).toFixed(1)}%)`);
  }


  score = Math.min(score, 100);
  const classification = score <= 30 ? "Safe" : score <= 70 ? "Suspicious" : "Dangerous";

  return { riskScore: score, classification, threats, extractedUrls, keywords: foundKeywords, spamProbability: spamProb };
};

const MessageAnalyzer = () => {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { triggerAlert } = useThreatAlert();

  const handleAnalyze = () => {
    if (!message.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const analysisResult = analyzeMessage(message);
      setResult(analysisResult);
      setIsAnalyzing(false);
      triggerAlert({
        type: "phishing",
        content: message.slice(0, 200),
        riskScore: analysisResult.riskScore,
        recommendedAction: "Do not click any links or reply to this message. Mark it as spam and delete it.",
      });
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Message Analyzer</h1>
        <p className="mt-1 text-sm text-muted-foreground">Paste a suspicious message to analyze it for phishing, scam, or spam patterns.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="card-shadow rounded-xl bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquareWarning className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold tracking-tight">Input Message</h2>
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste the suspicious SMS, email, or message here..."
            className="min-h-[200px] resize-none bg-input"
          />
          <Button
            onClick={handleAnalyze}
            disabled={!message.trim() || isAnalyzing}
            className="mt-4 w-full"
          >
            {isAnalyzing ? (
              <>
                <Scan className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Scan className="mr-2 h-4 w-4" />
                Analyze Message
              </>
            )}
          </Button>
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card-shadow rounded-xl bg-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold tracking-tight">Analysis Result</h2>
                <RiskBadge score={result.riskScore} />
              </div>

              <div className="flex justify-center mb-6">
                <RiskScoreCircle score={result.riskScore} size={140} />
              </div>
              {typeof result.spamProbability === "number" && (
                <div className="text-center mb-6 text-sm">
                  Dataset model predicts spam probability: <strong>{(result.spamProbability * 100).toFixed(1)}%</strong>
                </div>
              )}

              {/* Threats */}
              {result.threats.length > 0 && (
                <div className="mb-4">
                  <p className="label-caps mb-2">Threats Identified</p>
                  <div className="space-y-2">
                    {result.threats.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
                        <span className="text-muted-foreground">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.threats.length === 0 && (
                <div className="flex items-center gap-2 mb-4 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>No significant threats detected</span>
                </div>
              )}

              {/* Keywords */}
              {result.keywords.length > 0 && (
                <div className="mb-4">
                  <p className="label-caps mb-2">Flagged Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.keywords.map((k) => (
                      <span key={k} className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-mono text-destructive">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* URLs */}
              {result.extractedUrls.length > 0 && (
                <div>
                  <p className="label-caps mb-2">Extracted URLs</p>
                  <div className="space-y-1">
                    {result.extractedUrls.map((u, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <ShieldAlert className="h-3.5 w-3.5 text-destructive shrink-0" />
                        <span className="font-mono text-xs text-muted-foreground truncate">{u}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessageAnalyzer;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Search, Users, AlertTriangle, ShieldCheck, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RiskScoreCircle from "@/components/RiskScoreCircle";
import RiskBadge from "@/components/RiskBadge";

interface PhoneResult {
  number: string;
  riskScore: number;
  reports: number;
  type: string;
  carrier: string;
  location: string;
  recentActivity: string[];
}

const checkPhone = (number: string): PhoneResult => {
  // Simulated analysis
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
};

const PhoneChecker = () => {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<PhoneResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = () => {
    if (!phone.trim()) return;
    setIsChecking(true);
    setResult(null);
    setTimeout(() => {
      setResult(checkPhone(phone));
      setIsChecking(false);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Phone Number Checker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Verify phone numbers against scam databases and community reports.</p>
      </div>

      <div className="card-shadow rounded-xl bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Enter Phone Number</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="pl-10 bg-input"
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
          </div>
          <Button onClick={handleCheck} disabled={!phone.trim() || isChecking}>
            <Search className="mr-2 h-4 w-4" />
            Check
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-6 lg:grid-cols-3">
            <div className="card-shadow rounded-xl bg-card p-6 flex flex-col items-center justify-center">
              <RiskScoreCircle score={result.riskScore} size={140} />
              <div className="mt-4"><RiskBadge score={result.riskScore} /></div>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span className="tabular-nums">{result.reports} community reports</span>
              </div>
            </div>

            <div className="card-shadow rounded-xl bg-card p-6">
              <h2 className="text-base font-semibold tracking-tight mb-4">Number Details</h2>
              <div className="space-y-3">
                {[
                  { label: "Number", value: result.number },
                  { label: "Type", value: result.type },
                  { label: "Carrier", value: result.carrier },
                  { label: "Location", value: result.location },
                ].map((d) => (
                  <div key={d.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{d.label}</span>
                    <span className="text-sm font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-shadow rounded-xl bg-card p-6">
              <h2 className="text-base font-semibold tracking-tight mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {result.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {result.riskScore > 30 ? (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 shrink-0 text-success mt-0.5" />
                    )}
                    <span className="text-muted-foreground">{a}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Flag className="mr-2 h-3.5 w-3.5" />
                Report This Number
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PhoneChecker;

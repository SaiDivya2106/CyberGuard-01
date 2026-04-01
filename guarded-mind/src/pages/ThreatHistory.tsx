import { useState } from "react";
import { motion } from "framer-motion";
import { History, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RiskBadge from "@/components/RiskBadge";
import { recentThreats } from "@/lib/mockData";

const ThreatHistory = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const filtered = recentThreats.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (riskFilter === "safe" && t.riskScore > 30) return false;
    if (riskFilter === "suspicious" && (t.riskScore <= 30 || t.riskScore > 70)) return false;
    if (riskFilter === "dangerous" && t.riskScore <= 70) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Threat History</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse and filter all previously analyzed threats.</p>
      </div>

      <div className="card-shadow rounded-xl bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold tracking-tight">All Threats</h2>
            <span className="tabular-nums text-xs text-muted-foreground">({filtered.length})</span>
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 h-9 bg-input text-sm">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="phishing">Phishing</SelectItem>
                <SelectItem value="malicious_link">Malicious Link</SelectItem>
                <SelectItem value="scam_call">Scam Call</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-40 h-9 bg-input text-sm">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="suspicious">Suspicious</SelectItem>
                <SelectItem value="dangerous">Dangerous</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Timestamp</th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Content</th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Risk</th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((threat) => (
                <tr key={threat.id} className="border-b border-border last:border-0 transition-colors hover:bg-foreground/5">
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {new Date(threat.timestamp).toLocaleDateString()} {new Date(threat.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="label-caps">{threat.type.replace("_", " ")}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-mono text-xs text-muted-foreground truncate block max-w-sm">{threat.content}</span>
                  </td>
                  <td className="py-3 pr-4"><RiskBadge score={threat.riskScore} /></td>
                  <td className="py-3">
                    <span className={`text-xs font-medium capitalize ${
                      threat.status === "active" ? "text-destructive" : threat.status === "resolved" ? "text-success" : "text-muted-foreground"
                    }`}>{threat.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    No threats match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatHistory;

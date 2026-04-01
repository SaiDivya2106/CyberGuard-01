import { useState } from "react";
import { motion } from "framer-motion";
import { Flag, Send, MessageSquareWarning, Link2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CommunityReports = () => {
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!type || !content.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Thank you! Your report has been submitted.");
    setType("");
    setContent("");
    setDescription("");
  };

  const typeIcon = {
    phishing: MessageSquareWarning,
    malicious_link: Link2,
    scam_number: Phone,
  }[type] || Flag;

  const TypeIcon = typeIcon;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community Threat Reporting</h1>
        <p className="mt-1 text-sm text-muted-foreground">Report scam numbers, phishing messages, or malicious links to help protect the community.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-shadow rounded-xl bg-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Flag className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold tracking-tight">Submit a Report</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label-caps mb-2 block">Threat Type *</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phishing">Phishing Message</SelectItem>
                  <SelectItem value="malicious_link">Malicious Link</SelectItem>
                  <SelectItem value="scam_number">Scam Phone Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="label-caps mb-2 block">Content *</label>
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={type === "scam_number" ? "+1 (555) 123-4567" : type === "malicious_link" ? "https://suspicious-url.com" : "Paste the phishing message..."}
                className="bg-input"
              />
            </div>

            <div>
              <label className="label-caps mb-2 block">Description (optional)</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional context about this threat..."
                className="bg-input min-h-[100px] resize-none"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Submit Report
            </Button>
          </div>
        </div>

        <div className="card-shadow rounded-xl bg-card p-6">
          <h2 className="text-base font-semibold tracking-tight mb-4">Recent Community Reports</h2>
          <div className="space-y-3">
            {[
              { type: "scam_number", content: "+1 (555) 0142", time: "2 hours ago", reports: 24 },
              { type: "phishing", content: "Your package delivery failed...", time: "5 hours ago", reports: 18 },
              { type: "malicious_link", content: "https://free-gift-cards.scam.com", time: "1 day ago", reports: 42 },
              { type: "phishing", content: "Urgent: Your bank account locked", time: "1 day ago", reports: 31 },
              { type: "scam_number", content: "+44 20 7946 0958", time: "2 days ago", reports: 15 },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-muted p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <TypeIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.content}</p>
                    <p className="text-xs text-muted-foreground">{r.time}</p>
                  </div>
                </div>
                <span className="tabular-nums text-xs text-muted-foreground shrink-0 ml-3">{r.reports} reports</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityReports;

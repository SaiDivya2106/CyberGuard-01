export interface ThreatEntry {
  id: string;
  timestamp: string;
  type: "phishing" | "malicious_link" | "scam_call" | "spam";
  content: string;
  riskScore: number;
  classification: "Safe" | "Suspicious" | "Dangerous";
  status: "resolved" | "active" | "ignored";
}

export const recentThreats: ThreatEntry[] = [
  {
    id: "t-001",
    timestamp: "2026-03-12T14:23:00Z",
    type: "phishing",
    content: "Your account has been compromised. Click here to verify...",
    riskScore: 92,
    classification: "Dangerous",
    status: "active",
  },
  {
    id: "t-002",
    timestamp: "2026-03-12T11:05:00Z",
    type: "malicious_link",
    content: "https://secure-bank-login.suspicious-domain.com/verify",
    riskScore: 87,
    classification: "Dangerous",
    status: "resolved",
  },
  {
    id: "t-003",
    timestamp: "2026-03-11T16:42:00Z",
    type: "scam_call",
    content: "+1 (555) 0142 — IRS impersonation scam",
    riskScore: 78,
    classification: "Dangerous",
    status: "resolved",
  },
  {
    id: "t-004",
    timestamp: "2026-03-11T09:18:00Z",
    type: "spam",
    content: "Congratulations! You've won a free iPhone 16...",
    riskScore: 45,
    classification: "Suspicious",
    status: "ignored",
  },
  {
    id: "t-005",
    timestamp: "2026-03-10T20:30:00Z",
    type: "phishing",
    content: "Dear customer, update your payment method at...",
    riskScore: 85,
    classification: "Dangerous",
    status: "active",
  },
  {
    id: "t-006",
    timestamp: "2026-03-10T14:15:00Z",
    type: "malicious_link",
    content: "https://paypa1-secure.com/login",
    riskScore: 91,
    classification: "Dangerous",
    status: "resolved",
  },
  {
    id: "t-007",
    timestamp: "2026-03-09T08:00:00Z",
    type: "spam",
    content: "Limited time offer! Buy crypto now and get 500% returns",
    riskScore: 22,
    classification: "Safe",
    status: "ignored",
  },
];

export const weeklyThreatData = [
  { day: "Mon", threats: 12, phishing: 5, links: 4, scam: 3 },
  { day: "Tue", threats: 8, phishing: 3, links: 3, scam: 2 },
  { day: "Wed", threats: 15, phishing: 7, links: 5, scam: 3 },
  { day: "Thu", threats: 6, phishing: 2, links: 2, scam: 2 },
  { day: "Fri", threats: 19, phishing: 9, links: 6, scam: 4 },
  { day: "Sat", threats: 4, phishing: 1, links: 2, scam: 1 },
  { day: "Sun", threats: 7, phishing: 3, links: 2, scam: 2 },
];

export const threatDistribution = [
  { name: "Phishing", value: 42, fill: "hsl(0, 84%, 60%)" },
  { name: "Malicious Links", value: 28, fill: "hsl(38, 92%, 50%)" },
  { name: "Scam Calls", value: 18, fill: "hsl(212, 100%, 50%)" },
  { name: "Spam", value: 12, fill: "hsl(215, 15%, 65%)" },
];

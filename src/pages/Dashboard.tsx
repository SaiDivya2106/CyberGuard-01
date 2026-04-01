import { motion } from "framer-motion";
import { Shield, MessageSquareWarning, Link2, Phone, AlertTriangle, BarChart3, Bot, Send, Zap, Lock, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import RiskScoreCircle from "@/components/RiskScoreCircle";
import { Button } from "@/components/ui/button";
import { recentThreats, weeklyThreatData, threatDistribution } from "@/lib/mockData";
import { useState, useRef, useEffect } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } },
};

// ─── Inline Mini Chatbot ────────────────────────────────────────────────────

interface Msg { id: string; role: "user" | "bot"; text: string }

const quickChips = ["Scan a URL", "Check phishing risk", "Explain my score", "Latest threats"];

function getBotReply(input: string): string {
  const q = input.toLowerCase();
  if (q.match(/url|link|scan/)) return "Paste your URL into the **Link Scanner** tool in the sidebar. Our engine will check it against 40+ threat databases and return a risk score in seconds. 🔗";
  if (q.match(/phish|scam|message|email/)) return "Open the **Message Analyzer** and paste your suspicious text. Our NLP model flags social engineering patterns, spoofed sender names, and urgency tactics. 🎣";
  if (q.match(/score|risk|rating|explain/)) return "Your risk score (0–100) is computed from: threat DB matches, ML heuristics, domain age, SSL validity, and community reports. **Score 72** = Moderate — review recent alerts. 📊";
  if (q.match(/threat|latest|recent|new/)) return "Latest detected: **3 phishing SMS** (today), **1 malicious domain** (2h ago), **2 scam calls** flagged by community. Stay vigilant! 🛡️";
  if (q.match(/hello|hi|hey/)) return "Hello! I'm your CyberGuard AI assistant. Ask me to scan links, explain threats, or guide you through any feature. 👋";
  return "I can help you scan links, analyze messages, check phone numbers, or explain your security score. What would you like to do? 🤖";
}

const DashboardChat = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "0", role: "bot", text: "Hi! I'm your **CyberGuard AI**. Ask me to analyze a threat, explain your score, or guide you through our tools." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages(p => [...p, { id: Date.now().toString(), role: "user", text: text.trim() }]);
    setInput("");
    setTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
    setTyping(false);
    setMessages(p => [...p, { id: (Date.now() + 1).toString(), role: "bot", text: getBotReply(text) }]);
  };

  const fmt = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((p, i) =>
      i % 2 === 1 ? <strong key={i} className="text-primary">{p}</strong> : p
    );

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3" style={{ maxHeight: 260 }}>
        {messages.map(m => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "bot" && (
              <div className="h-6 w-6 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-3 w-3 text-primary" />
              </div>
            )}
            <div className={`max-w-[82%] rounded-2xl text-xs leading-relaxed px-3 py-2 ${
              m.role === "user"
                ? "bg-primary text-white rounded-tr-sm"
                : "bg-muted/50 text-foreground rounded-tl-sm border border-border/30"
            }`}>
              {fmt(m.text)}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3 w-3 text-primary" />
            </div>
            <div className="bg-muted/50 border border-border/30 rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
              {[0, 0.18, 0.36].map((d, i) => (
                <motion.div key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 0.55, repeat: Infinity, delay: d }} className="h-1.5 w-1.5 rounded-full bg-primary/50" />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none mb-3 pb-0.5">
        {quickChips.map(c => (
          <button key={c} onClick={() => send(c)} className="flex-shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full border border-primary/25 bg-primary/5 text-primary hover:bg-primary/15 transition-colors whitespace-nowrap">
            {c}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2 focus-within:border-primary/40 transition-all">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Ask about threats, tools, scores…"
          className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
        />
        <button onClick={() => send(input)} disabled={!input.trim() || typing} className="h-6 w-6 rounded-lg bg-primary disabled:opacity-30 flex items-center justify-center flex-shrink-0 transition-opacity">
          <Send className="h-3 w-3 text-white" />
        </button>
      </div>
    </div>
  );
};

// ─── Main Dashboard ─────────────────────────────────────────────────────────

const quickActions = [
  { label: "Scan Link", icon: Link2, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20" },
  { label: "Analyze Message", icon: MessageSquareWarning, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20 hover:bg-red-500/20" },
  { label: "Check Phone", icon: Phone, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20 hover:bg-green-500/20" },
  { label: "Run Report", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20" },
];

const Dashboard = () => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Security Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground font-medium">Real-time cyber threat monitoring & AI-powered analysis</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          SYSTEMS OPTIMIZED
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map(a => (
          <button key={a.label} className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${a.bg}`}>
            <a.icon className={`h-4 w-4 flex-shrink-0 ${a.color}`} />
            <span className="text-xs font-semibold text-foreground">{a.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Security Score" value="72" icon={Shield} iconColor="text-primary" change="+3 points" changeType="positive" />
        <StatCard title="Phishing Detected" value="42" icon={MessageSquareWarning} iconColor="text-destructive" change="+12 this week" changeType="negative" />
        <StatCard title="Links Scanned" value="156" icon={Link2} iconColor="text-warning" change="28 flagged" changeType="neutral" />
        <StatCard title="Scam Numbers" value="18" icon={Phone} iconColor="text-success" change="3 new reports" changeType="neutral" />
      </motion.div>

      {/* Charts + AI Chat */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Weekly Trends */}
        <motion.div
          variants={item}
          className="card-shadow rounded-2xl bg-card/50 backdrop-blur-sm p-6 lg:col-span-2 border border-border/50"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Weekly Threat Trends</h2>
              <p className="mt-1 text-xs text-muted-foreground font-medium">Threats detected over the past 7 days</p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyThreatData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="threats" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorThreats)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Chat Panel */}
        <motion.div
          variants={item}
          className="card-shadow rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 overflow-hidden flex flex-col"
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/30 bg-gradient-to-r from-primary/10 to-blue-500/5">
            <div className="relative">
              <div className="h-8 w-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-background border-2 border-background">
                <div className="h-full w-full rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">CyberGuard AI</p>
              <p className="text-[10px] text-green-400 font-medium">● Active Analyst</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2.5 py-1 border border-primary/20">
              <Zap className="h-3 w-3" />
              AI Powered
            </div>
          </div>

          {/* Chat body */}
          <div className="flex-1 p-4">
            <DashboardChat />
          </div>
        </motion.div>
      </div>

      {/* Distribution + Recent Threats */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Threat Distribution */}
        <motion.div variants={item} className="card-shadow rounded-2xl bg-card/50 backdrop-blur-sm p-6 border border-border/50">
          <h2 className="text-base font-semibold tracking-tight mb-6">Threat Distribution</h2>
          <div className="h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={threatDistribution} cx="50%" cy="50%" innerRadius={52} outerRadius={72} dataKey="value" strokeWidth={0} paddingAngle={4}>
                  {threatDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">71</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="mt-6 space-y-2.5">
            {threatDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-muted-foreground font-medium">{item.name}</span>
                </div>
                <span className="tabular-nums font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk Score */}
        <motion.div variants={item} className="card-shadow rounded-2xl bg-card/50 backdrop-blur-sm p-6 flex flex-col items-center justify-center border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Shield className="h-28 w-28" />
          </div>
          <h2 className="text-base font-semibold tracking-tight mb-6">Overall Risk Index</h2>
          <RiskScoreCircle score={72} size={152} />
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground font-medium max-w-[200px]">
              Security posture improved by <span className="text-green-400 font-bold">4.2%</span> this month.
            </p>
            <div className="flex items-center gap-1.5 justify-center text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-3 py-1.5 border border-primary/20 w-fit mx-auto">
              <Lock className="h-3 w-3" />
              Moderate Risk
            </div>
          </div>
        </motion.div>

        {/* Recent Threats */}
        <motion.div variants={item} className="card-shadow rounded-2xl bg-card/50 backdrop-blur-sm p-6 border border-border/50">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Recent Threats</h2>
              <p className="mt-0.5 text-xs text-muted-foreground font-medium">Live data stream</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest hover:bg-muted">
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {recentThreats.slice(0, 5).map((threat) => (
              <div key={threat.id} className="group flex items-center gap-3 rounded-xl p-3 hover:bg-muted/30 transition-colors border border-transparent hover:border-border/30">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-muted/60 border border-border/40 uppercase">
                      {threat.type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground truncate group-hover:text-foreground transition-colors">
                    {threat.content}
                  </p>
                </div>
                <RiskBadge score={threat.riskScore} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

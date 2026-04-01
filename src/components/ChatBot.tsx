import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Shield,
  Bot,
  ChevronDown,
  Minimize2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

const quickReplies = [
  "How do I scan a link?",
  "What is phishing?",
  "Is this phone number safe?",
  "How does risk scoring work?",
];

const botResponses: Record<string, string> = {
  default:
    "I'm CyberGuard Assistant. I can help you understand threats, guide you through our tools, or explain your risk scores. What would you like to know?",
  phishing:
    "Phishing is a cyberattack where criminals impersonate trusted entities to steal sensitive data. Our Phishing Analyzer uses AI to detect suspicious language patterns, spoofed domains, and social engineering tactics. Navigate to **Message Analyzer** to paste a suspicious message.",
  link:
    "To scan a link: go to **Link Scanner** in the sidebar, paste the URL, and click 'Analyze'. Our engine checks it against threat databases, WHOIS data, and SSL certificate validity in seconds.",
  phone:
    "To check a phone number: navigate to **Phone Checker**, enter the number, and submit. We cross-reference it against scam databases and show you community reports.",
  risk:
    "Risk scores are calculated using a multi-factor engine: threat intelligence feeds, ML heuristics trained on real-world data, domain age, SSL validity, and community reports. Scores 0–40 are Safe, 40–70 are Suspicious, 70–100 are Dangerous.",
  hello:
    "Hello! I'm CyberGuard Assistant 🛡️. I'm here to help you stay safe online. Ask me about phishing, link scanning, phone verification, or anything cybersecurity-related!",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.match(/\b(hi|hello|hey|greet)/)) return botResponses.hello;
  if (lower.match(/\b(phish|scam|spam|trick|fake)/)) return botResponses.phishing;
  if (lower.match(/\b(link|url|website|site|scan)/)) return botResponses.link;
  if (lower.match(/\b(phone|number|call|mobile)/)) return botResponses.phone;
  if (lower.match(/\b(risk|score|danger|safe|rating)/)) return botResponses.risk;
  return botResponses.default;
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "bot",
      text: "👋 Hi! I'm the **CyberGuard Assistant**. How can I help you stay safe today?",
      timestamp: new Date(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "bot",
      text: getBotResponse(text),
      timestamp: new Date(),
    };
    setTyping(false);
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatText = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="text-primary font-semibold">{part}</strong> : part
    );

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setOpen(true); setMinimized(false); }}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-blue-500 shadow-[0_0_30px_rgba(0,122,255,0.5)] flex items-center justify-center text-white"
          >
            <div className="absolute inset-0 rounded-2xl animate-ping bg-primary/40 opacity-30" />
            <MessageCircle className="h-6 w-6 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] rounded-3xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            style={{ height: minimized ? "auto" : "520px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-primary/15 to-blue-500/10 border-b border-border/30">
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/30 to-blue-500/20 border border-primary/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-background border-2 border-background flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">CyberGuard Assistant</p>
                <p className="text-[10px] text-green-400 font-medium">● Online — AI Analyst</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setMinimized((v) => !v)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  {minimized ? <ChevronDown className="h-3.5 w-3.5 rotate-180" /> : <Minimize2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!minimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        {msg.role === "bot" && (
                          <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Bot className="h-3.5 w-3.5 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-primary text-white rounded-tr-sm"
                              : "bg-muted/60 text-foreground rounded-tl-sm border border-border/30"
                          }`}
                        >
                          {formatText(msg.text)}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    <AnimatePresence>
                      {typing && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="flex gap-2.5"
                        >
                          <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="bg-muted/60 border border-border/30 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                            {[0, 0.2, 0.4].map((delay, i) => (
                              <motion.div
                                key={i}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay }}
                                className="h-1.5 w-1.5 rounded-full bg-primary/60"
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                  </div>

                  {/* Quick replies */}
                  <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
                    {quickReplies.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="flex-shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 transition-colors whitespace-nowrap"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 rounded-2xl border border-border/50 bg-muted/40 px-3.5 py-2 focus-within:border-primary/40 focus-within:bg-muted/60 transition-all">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about threats, tools, scores..."
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || typing}
                        className="h-7 w-7 rounded-xl bg-primary disabled:opacity-40 flex items-center justify-center text-white flex-shrink-0 transition-opacity"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
                      CyberGuard AI · Simulated Responses
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

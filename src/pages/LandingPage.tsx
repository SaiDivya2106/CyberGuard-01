import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  MessageSquareWarning,
  Link2,
  Phone,
  BarChart3,
  CheckCircle2,
  Zap,
  Eye,
  Lock,
  ChevronRight,
  Star,
  Github,
  Twitter,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const features = [
  {
    icon: MessageSquareWarning,
    title: "Phishing Analyzer",
    description: "AI-powered detection of phishing messages, scam texts, and social engineering attacks.",
    color: "from-red-500/20 to-orange-500/10",
    iconColor: "text-red-400",
    border: "border-red-500/20",
  },
  {
    icon: Link2,
    title: "Link Scanner",
    description: "Real-time URL reputation analysis using threat intelligence APIs and domain scoring.",
    color: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    icon: Phone,
    title: "Phone Checker",
    description: "Verify phone numbers against scam databases and community reports instantly.",
    color: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-400",
    border: "border-green-500/20",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring",
    description: "Multi-factor risk assessment engine combining heuristic rules with ML models.",
    color: "from-purple-500/20 to-violet-500/10",
    iconColor: "text-purple-400",
    border: "border-purple-500/20",
  },
];

const steps = [
  { step: "01", icon: Eye, title: "Submit Suspicious Content", desc: "Paste a message, URL, or phone number into CyberGuard." },
  { step: "02", icon: Zap, title: "AI Analysis Runs", desc: "Our engine scans against threat databases and ML heuristics in milliseconds." },
  { step: "03", icon: CheckCircle2, title: "Get Your Risk Report", desc: "Receive a detailed risk score with explanations and recommended actions." },
];

const testimonials = [
  { name: "Sarah K.", role: "IT Security Manager", text: "CyberGuard caught a phishing attempt our email filter missed. Incredible accuracy.", stars: 5 },
  { name: "Marcus T.", role: "Freelance Developer", text: "The link scanner saved me from clicking a malicious link disguised as a Github repo.", stars: 5 },
  { name: "Priya N.", role: "Small Business Owner", text: "My employees use it daily to verify suspicious texts. Simple and fast.", stars: 5 },
];

const trustLogos = ["Fortinet", "CrowdStrike", "Palo Alto", "Splunk", "SentinelOne"];

const LandingPage = () => {
  const { enterAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuestAccess = () => {
    enterAsGuest();
    toast.success("Welcome! Entered as Guest.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
              <Shield className="relative h-7 w-7 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              CyberGuard
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(0,122,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(0,122,255,0.5)]">
                Open Dashboard
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16 overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/8 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/8 blur-[80px]" />
        </div>

        {/* Animated grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-xs font-semibold text-primary backdrop-blur-sm"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Threat Intelligence Active — 1,402 threats analyzed today
          </motion.div>

          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tighter sm:text-6xl lg:text-7xl">
            <span className="block text-foreground">Your AI-Powered</span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Cyber Defense Platform
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Detect phishing messages, scan malicious links, verify suspicious phone numbers — all with enterprise-grade AI. Real-time protection, zero setup required.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="h-13 px-9 text-base rounded-full bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(0,122,255,0.4)] hover:shadow-[0_0_50px_rgba(0,122,255,0.6)] transition-all duration-300 font-semibold">
                Launch Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/analyzer">
              <Button variant="outline" size="lg" className="h-13 px-9 text-base rounded-full border-border/60 bg-background/60 backdrop-blur-sm hover:bg-card hover:border-primary/40 transition-all duration-300 font-semibold">
                Try Analyzer Free
              </Button>
            </Link>
          </div>

          <button
            onClick={handleGuestAccess}
            className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium group"
          >
            No account needed —{" "}
            <span className="underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary transition-all">
              Continue as Guest
            </span>
            <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Trust stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: "1,402", label: "Threats Analyzed" },
              { value: "99.2%", label: "Detection Rate" },
              { value: "24/7", label: "Monitoring" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-4">
                <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust logos */}
      <section className="border-y border-border/30 py-10 bg-card/20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-8">
            Trusted by security teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {trustLogos.map((logo) => (
              <div key={logo} className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
                <Lock className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold tracking-tight text-foreground">{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="label-caps text-primary mb-3">Core Modules</p>
            <h2 className="text-4xl font-bold tracking-tight">
              Comprehensive threat analysis
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Four powerful AI modules working together to keep you protected from modern cyber threats.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className={`group relative rounded-2xl border ${f.border} bg-gradient-to-b ${f.color} p-6 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className={`rounded-xl bg-background/50 p-3 w-fit ${f.iconColor} mb-5 border border-white/10`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore module <ArrowRight className="h-3 w-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 px-6 border-t border-border/30 bg-card/10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="label-caps text-primary mb-3">Workflow</p>
            <h2 className="text-4xl font-bold tracking-tight">How CyberGuard works</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Three simple steps from suspicious content to a full risk report.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm"
              >
                <div className="text-6xl font-black text-primary/10 absolute top-4 right-6 select-none">{s.step}</div>
                <div className="relative z-10 h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-28 px-6 border-t border-border/30">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="label-caps text-primary mb-3">Social Proof</p>
            <h2 className="text-4xl font-bold tracking-tight">Trusted by security professionals</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 border-t border-border/30">
        <div className="mx-auto max-w-3xl text-center">
          <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,122,255,0.15),transparent_70%)]" />
            <div className="relative">
              <Shield className="h-12 w-12 text-primary mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl font-bold tracking-tight mb-4">Start protecting yourself today</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join thousands of users who trust CyberGuard to keep them safe from modern cyber threats.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" className="rounded-full px-8 shadow-[0_0_30px_rgba(0,122,255,0.3)] hover:shadow-[0_0_50px_rgba(0,122,255,0.5)] transition-all duration-300">
                    Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <button onClick={handleGuestAccess}>
                  <Button variant="outline" size="lg" className="rounded-full px-8">
                    Try as Guest
                  </Button>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-bold text-foreground">CyberGuard</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Intelligent Cyber Threat Defense Platform. Powered by AI.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="h-4 w-4" /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="h-4 w-4" /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Globe className="h-4 w-4" /></a>
              </div>
            </div>
            {[
              { heading: "Product", links: ["Dashboard", "Phishing Analyzer", "Link Scanner", "Phone Checker"] },
              { heading: "Resources", links: ["Documentation", "API Reference", "Blog", "Changelog"] },
              { heading: "Company", links: ["About", "Privacy Policy", "Terms of Service", "Contact"] },
            ].map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">{col.heading}</p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2025 CyberGuard. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Built with ❤️ for a safer internet</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

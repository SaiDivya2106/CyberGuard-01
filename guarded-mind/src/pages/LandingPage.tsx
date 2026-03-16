import { motion } from "framer-motion";
import { Shield, ArrowRight, MessageSquareWarning, Link2, Phone, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: MessageSquareWarning,
    title: "Phishing Analyzer",
    description: "AI-powered detection of phishing messages, scam texts, and social engineering attacks.",
  },
  {
    icon: Link2,
    title: "Link Scanner",
    description: "Real-time URL reputation analysis using threat intelligence APIs and domain scoring.",
  },
  {
    icon: Phone,
    title: "Phone Checker",
    description: "Verify phone numbers against scam databases and community reports.",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring",
    description: "Multi-factor risk assessment engine combining heuristic rules with machine learning models trained on real-world datasets.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">CyberGuard</span>
          </div>
          <Link to="/dashboard">
            <Button size="sm">
              Open Dashboard
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Threat Intelligence Active</span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tighter sm:text-6xl lg:text-7xl">
            Stop guessing.
            <br />
            <span className="text-primary">Start analyzing.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground" style={{ textWrap: "pretty" as any }}>
            CyberGuard is your intelligent cyber threat defense platform. Detect phishing, scan malicious links, and verify suspicious numbers — all in one place.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base">
                Launch Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/analyzer">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Try Analyzer
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="tabular-nums"><strong className="text-foreground">1,402</strong> threats analyzed</span>
            <span className="h-4 w-px bg-border" />
            <span className="tabular-nums"><strong className="text-foreground">99.2%</strong> detection rate</span>
            <span className="h-4 w-px bg-border" />
            <span className="tabular-nums"><strong className="text-foreground">24/7</strong> monitoring</span>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="label-caps text-center">Core Modules</p>
            <h2 className="mt-3 text-center text-3xl font-bold tracking-tight">
              Comprehensive threat analysis
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="card-shadow rounded-xl bg-card p-6 transition-all duration-200 hover:card-shadow-hover hover:-translate-y-0.5"
              >
                <div className="rounded-lg bg-muted p-2.5 w-fit text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">CyberGuard</span>
          </div>
          <p className="text-xs text-muted-foreground">Intelligent Cyber Threat Defense</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

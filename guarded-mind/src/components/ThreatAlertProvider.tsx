import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert, X, Flag, Ban, Eye, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import RiskBadge from "@/components/RiskBadge";
import { toast } from "sonner";

interface ThreatAlert {
  id: string;
  type: string;
  content: string;
  riskScore: number;
  recommendedAction: string;
}

interface ThreatAlertContextType {
  triggerAlert: (alert: Omit<ThreatAlert, "id">) => void;
}

const ThreatAlertContext = createContext<ThreatAlertContextType>({ triggerAlert: () => {} });

export const useThreatAlert = () => useContext(ThreatAlertContext);

export const ThreatAlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<ThreatAlert | null>(null);

  const triggerAlert = useCallback((a: Omit<ThreatAlert, "id">) => {
    if (a.riskScore > 70) {
      setAlert({ ...a, id: crypto.randomUUID() });
    }
  }, []);

  const dismiss = () => setAlert(null);

  const handleIgnore = () => {
    toast.info("Threat ignored. It will remain in your history.");
    dismiss();
  };

  const handleReport = () => {
    toast.success("Threat reported to the community database.");
    dismiss();
  };

  const handleBlock = () => {
    toast.success("Threat source has been blocked.");
    dismiss();
  };

  return (
    <ThreatAlertContext.Provider value={{ triggerAlert }}>
      {children}
      <AnimatePresence>
        {alert && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              onClick={dismiss}
            />

            {/* Alert Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-6 shadow-elevated"
            >
              {/* Close */}
              <button onClick={dismiss} className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>

              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-destructive/10 p-2.5">
                  <ShieldAlert className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Threat Detected</h2>
                  <p className="label-caps mt-0.5">{alert.type.replace("_", " ")}</p>
                </div>
              </div>

              {/* Risk Score */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Risk Score:</span>
                <RiskBadge score={alert.riskScore} />
              </div>

              {/* Content */}
              <div className="mb-4 rounded-lg bg-muted p-3">
                <p className="label-caps mb-1">Detected Content</p>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed break-all">{alert.content}</p>
              </div>

              {/* Recommended Action */}
              <div className="mb-6 flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
                <span className="text-muted-foreground">{alert.recommendedAction}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={handleIgnore}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Ignore
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={handleReport}>
                  <Flag className="mr-1.5 h-3.5 w-3.5" />
                  Report
                </Button>
                <Button variant="destructive" size="sm" className="flex-1" onClick={handleBlock}>
                  <Ban className="mr-1.5 h-3.5 w-3.5" />
                  Block
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ThreatAlertContext.Provider>
  );
};

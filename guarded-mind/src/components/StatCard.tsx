import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

const StatCard = ({ title, value, change, changeType = "neutral", icon: Icon, iconColor = "text-primary" }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-shadow rounded-xl bg-card p-6 transition-all duration-200 hover:card-shadow-hover hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="label-caps">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tighter tabular-nums">{value}</p>
          {change && (
            <p className={`mt-1 text-xs font-medium ${
              changeType === "positive" ? "text-success" : changeType === "negative" ? "text-destructive" : "text-muted-foreground"
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`rounded-lg bg-muted p-2.5 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;

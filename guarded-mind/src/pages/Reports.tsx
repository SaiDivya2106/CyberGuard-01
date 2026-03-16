import { motion } from "framer-motion";
import { FileBarChart, TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/StatCard";
import { weeklyThreatData } from "@/lib/mockData";

const Reports = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Weekly Security Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">Summary of threat activity for the current week.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard title="Total Threats" value="71" icon={ShieldAlert} iconColor="text-destructive" change="+8% from last week" changeType="negative" />
        <StatCard title="Most Common" value="Phishing" icon={TrendingUp} iconColor="text-warning" change="42% of all threats" changeType="neutral" />
        <StatCard title="High Risk Alerts" value="14" icon={TrendingDown} iconColor="text-primary" change="-2 from last week" changeType="positive" />
      </div>

      <div className="card-shadow rounded-xl bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileBarChart className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold tracking-tight">Threats by Category</h2>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyThreatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 20%, 22%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(224, 15%, 15%)", border: "1px solid hsl(217, 20%, 22%)", borderRadius: 8, fontSize: 12, color: "hsl(210, 40%, 98%)" }} />
              <Bar dataKey="phishing" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="links" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="scam" fill="hsl(212, 100%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-sm bg-destructive" /><span className="text-muted-foreground">Phishing</span></div>
          <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-sm bg-warning" /><span className="text-muted-foreground">Malicious Links</span></div>
          <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-sm bg-primary" /><span className="text-muted-foreground">Scam Calls</span></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;

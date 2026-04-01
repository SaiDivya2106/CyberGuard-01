import { motion } from "framer-motion";
import { Shield, MessageSquareWarning, Link2, Phone, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import RiskScoreCircle from "@/components/RiskScoreCircle";
import { recentThreats, weeklyThreatData, threatDistribution } from "@/lib/mockData";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const Dashboard = () => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor and manage your cyber threat landscape.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Security Score" value="72" icon={Shield} iconColor="text-primary" change="+3 from last week" changeType="positive" />
        <StatCard title="Phishing Detected" value="42" icon={MessageSquareWarning} iconColor="text-destructive" change="+12 this week" changeType="negative" />
        <StatCard title="Links Scanned" value="156" icon={Link2} iconColor="text-warning" change="28 flagged" changeType="neutral" />
        <StatCard title="Scam Numbers" value="18" icon={Phone} iconColor="text-success" change="3 new reports" changeType="neutral" />
      </div>

      {/* Charts + Score */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-shadow rounded-xl bg-card p-6 lg:col-span-2"
        >
          <h2 className="text-base font-semibold tracking-tight">Weekly Threat Trends</h2>
          <p className="mt-1 text-xs text-muted-foreground">Threats detected over the past 7 days</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyThreatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 20%, 22%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215, 15%, 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(224, 15%, 15%)",
                    border: "1px solid hsl(217, 20%, 22%)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "hsl(210, 40%, 98%)",
                  }}
                />
                <Area type="monotone" dataKey="threats" stroke="hsl(212, 100%, 50%)" fill="hsl(212, 100%, 50%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-shadow rounded-xl bg-card p-6 flex flex-col items-center justify-center"
        >
          <h2 className="text-base font-semibold tracking-tight mb-2">Overall Risk</h2>
          <RiskScoreCircle score={72} />
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Based on 71 threats analyzed this week
          </p>
        </motion.div>
      </div>

      {/* Distribution + Recent Threats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Threat Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-shadow rounded-xl bg-card p-6"
        >
          <h2 className="text-base font-semibold tracking-tight">Threat Distribution</h2>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={threatDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                  {threatDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(224, 15%, 15%)",
                    border: "1px solid hsl(217, 20%, 22%)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "hsl(210, 40%, 98%)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {threatDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.fill }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="tabular-nums font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Threats Table */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-shadow rounded-xl bg-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold tracking-tight">Recent Threats</h2>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Content</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Risk</th>
                  <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentThreats.slice(0, 5).map((threat) => (
                  <tr key={threat.id} className="border-b border-border last:border-0 transition-colors hover:bg-foreground/5">
                    <td className="py-3 pr-4">
                      <span className="label-caps">{threat.type.replace("_", " ")}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs text-muted-foreground truncate block max-w-xs">
                        {threat.content.slice(0, 50)}...
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <RiskBadge score={threat.riskScore} />
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-medium capitalize ${
                        threat.status === "active" ? "text-destructive" : threat.status === "resolved" ? "text-success" : "text-muted-foreground"
                      }`}>
                        {threat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

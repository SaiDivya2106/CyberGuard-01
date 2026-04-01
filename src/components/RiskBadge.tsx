interface RiskBadgeProps {
  score: number;
  showScore?: boolean;
}

const getRiskLevel = (score: number) => {
  if (score <= 30) return { label: "Safe", className: "risk-badge-safe" };
  if (score <= 70) return { label: "Suspicious", className: "risk-badge-suspicious" };
  return { label: "Dangerous", className: "risk-badge-dangerous" };
};

const RiskBadge = ({ score, showScore = true }: RiskBadgeProps) => {
  const risk = getRiskLevel(score);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${risk.className}`}>
      {risk.label}
      {showScore && <span className="tabular-nums opacity-70">({score})</span>}
    </span>
  );
};

export default RiskBadge;
export { getRiskLevel };

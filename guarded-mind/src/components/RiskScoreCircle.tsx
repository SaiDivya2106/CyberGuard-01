import { motion } from "framer-motion";

interface RiskScoreCircleProps {
  score: number;
  size?: number;
}

const RiskScoreCircle = ({ score, size = 160 }: RiskScoreCircleProps) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = () => {
    if (score <= 30) return "hsl(142, 71%, 45%)";
    if (score <= 70) return "hsl(38, 92%, 50%)";
    return "hsl(0, 84%, 60%)";
  };

  const getLabel = () => {
    if (score <= 30) return "Safe";
    if (score <= 70) return "Suspicious";
    return "Dangerous";
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(217, 20%, 22%)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold tracking-tighter tabular-nums" style={{ color: getColor() }}>
          {score}
        </span>
        <span className="label-caps mt-1">{getLabel()}</span>
      </div>
    </div>
  );
};

export default RiskScoreCircle;

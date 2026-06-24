/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

interface IndicatorRingProps {
  value: number;
  label: string;
  subtitle: string;
  previousValue: string;
  percentageChange: string;
  isPositive: boolean;
  color: "orange" | "green" | "crimson" | "cyan";
  id?: string;
}

export default function IndicatorRing({
  value,
  label,
  subtitle,
  previousValue,
  percentageChange,
  isPositive,
  color,
  id
}: IndicatorRingProps) {
  // Translate color to real Tailwind and HEX code values for SVGs
  const colorMap = {
    orange: {
      stroke: "#fb923c",
      bgStroke: "rgba(251, 146, 60, 0.12)",
      text: "text-orange-400"
    },
    green: {
      stroke: "#4ade80",
      bgStroke: "rgba(74, 222, 128, 0.12)",
      text: "text-green-400"
    },
    crimson: {
      stroke: "#f87171",
      bgStroke: "rgba(248, 113, 113, 0.12)",
      text: "text-red-400"
    },
    cyan: {
      stroke: "#22d3ee",
      bgStroke: "rgba(34, 211, 238, 0.12)",
      text: "text-cyan-400"
    }
  };

  const currentStyle = colorMap[color];
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div 
      id={id || `indicator-ring-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className="bg-[#12121a] rounded-[24px] border border-[rgba(255,255,255,0.04)] p-6 hover:border-[rgba(255,255,255,0.1)] transition-all duration-300 flex items-center justify-between"
    >
      <div className="flex flex-col min-w-0 pr-4">
        {/* Title */}
        <span className="text-[11px] text-gray-400 uppercase tracking-widest font-sans font-medium">
          {label}
        </span>
        
        {/* Current Val */}
        <span className="text-xl font-bold text-white mt-1.5 font-sans [font-variant-numeric:tabular-nums]">
          {subtitle}
        </span>

        {/* Change comparing metrics row */}
        <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-500 font-sans">
          <span>Semana pass.</span>
          <span className="text-white font-medium">{previousValue}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold font-sans">
          <span className={isPositive ? "text-green-400" : "text-red-400"}>
            {percentageChange} {isPositive ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Circle dial */}
      <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={currentStyle.bgStroke}
            strokeWidth="10"
            fill="transparent"
          />
          {/* Active progress track */}
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            stroke={currentStyle.stroke}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Inner number indicator */}
        <span className="absolute text-base font-bold text-white font-sans [font-variant-numeric:tabular-nums]">
          {Math.round(value)}
        </span>
      </div>
    </div>
  );
}

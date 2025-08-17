"use client";

import React from "react";

interface Slice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: Slice[];
  size?: number;
  thickness?: number;
}

export default function DonutChart({ data, size = 140, thickness = 14 }: DonutChartProps) {
  const radius = size / 2;
  const circumference = 2 * Math.PI * (radius - thickness / 2);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  let offset = 0;
  const arcs = data.map((d, i) => {
    const frac = d.value / total;
    const dash = frac * circumference;
    const dashArray = `${dash} ${circumference - dash}`;
    const el = (
      <circle
        key={i}
        r={radius - thickness / 2}
        cx={radius}
        cy={radius}
        fill="transparent"
        stroke={d.color}
        strokeWidth={thickness}
        strokeDasharray={dashArray}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
    );
    offset += dash;
    return el;
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{arcs}</svg>
      <div className="space-y-1">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: d.color }} />
            <span className="text-gray-700 dark:text-gray-200">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}



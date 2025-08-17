"use client";

import React, { useMemo } from "react";

interface Series {
  name: string;
  values: number[];
  color: string;
}

interface BarChartProps {
  labels: string[];
  series: Series[];
  width?: number;
  height?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  groupGap?: number; // gap between month groups
  barGap?: number; // gap between bars within a group
  rounded?: number; // corner radius
}

export default function BarChart({
  labels,
  series,
  width = 720,
  height = 220,
  padding = { top: 16, right: 16, bottom: 28, left: 24 },
  groupGap = 8,
  barGap = 6,
  rounded = 3,
}: BarChartProps) {
  const maxValue = useMemo(() => {
    const all = series.flatMap((s) => s.values);
    return Math.max(1, ...all);
  }, [series]);

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const groups = labels.length;
  const barsPerGroup = series.length;

  const groupWidth = (chartWidth - groupGap * (groups - 1)) / groups;
  const barWidth = (groupWidth - barGap * (barsPerGroup - 1)) / barsPerGroup;

  return (
    <div className="w-full overflow-x-auto text-gray-500 dark:text-gray-400">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className="min-w-full"
      >
        {/* X labels */}
        {labels.map((label, i) => {
          const x = padding.left + i * (groupWidth + groupGap) + groupWidth / 2;
          const y = height - 6;
          return (
            <text key={label + i} x={x} y={y} fontSize={10} textAnchor="middle">
              {label}
            </text>
          );
        })}

        {/* Bars */}
        {series.map((s, si) =>
          s.values.map((v, i) => {
            const scaled = (v / maxValue) * chartHeight;
            const x = padding.left + i * (groupWidth + groupGap) + si * (barWidth + barGap);
            const y = padding.top + (chartHeight - scaled);
            return (
              <rect
                key={`${s.name}-${i}`}
                x={x}
                y={y}
                width={barWidth}
                height={scaled}
                fill={s.color}
                rx={rounded}
                ry={rounded}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}



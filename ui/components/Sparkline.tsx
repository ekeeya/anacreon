"use client";

import React, { useMemo } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

export default function Sparkline({
  data,
  width = 120,
  height = 36,
  color = "#3b82f6",
  strokeWidth = 2,
  fill = "none",
}: SparklineProps) {
  const path = useMemo(() => {
    if (!data || data.length === 0) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const dx = width / Math.max(1, data.length - 1);
    const norm = (v: number) => {
      if (max === min) return height / 2;
      return height - ((v - min) / (max - min)) * height;
    };
    return data
      .map((v, i) => `${i === 0 ? "M" : "L"}${i * dx},${norm(v)}`)
      .join(" ");
  }, [data, width, height]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill !== "none" && (
        <path d={`${path} L ${width},${height} L 0,${height} Z`} fill={fill} opacity={0.15} />
      )}
      <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}



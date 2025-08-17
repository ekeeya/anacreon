"use client";

import React, { useMemo, useState } from "react";
import Sparkline from "@/components/Sparkline";
import DonutChart from "@/components/DonutChart";
import BarChart from "@/components/BarChart";

export default function Dashboard() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");

  const stats = useMemo(() => ([
    { label: "Revenue", value: "$12,400", change: "+8%", series: [4,6,5,7,9,8,10] },
    { label: "Orders", value: "87", change: "+5%", series: [6,5,6,7,6,7,8] },
    { label: "Items in Stock", value: "320", change: "+2%", series: [320,321,319,320,322,323,320] },
    { label: "Expenditures", value: "$2,100", change: "-1%", series: [2.1,2.2,2.0,2.1,2.15,2.05,2.1] },
  ]), []);

  const orderBreakdown = [
    { label: "Completed", value: 62, color: "#10b981" },
    { label: "Pending", value: 18, color: "#a3a3a3" },
    { label: "Cancelled", value: 7, color: "#ef4444" },
  ];

  const lowStock = [
    { name: "Sugar 1kg", qty: 3 },
    { name: "Milk 500ml", qty: 5 },
    { name: "Bread", qty: 2 },
  ];

  return (
    <div className="space-y-6 animate-fadein">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Overview</h1>
        <div className="flex items-center gap-2">
          {(["7d","30d","90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1 text-sm border ${range === r ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-4 shadow-sm">
            <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</div>
              <div className={`text-xs font-semibold ${s.change.startsWith('-') ? 'text-red-500' : 'text-green-600'}`}>{s.change}</div>
            </div>
            <div className="mt-2">
              <Sparkline
                data={s.series}
                width={160}
                height={36}
                color={
                  s.label === "Revenue" ? "#86efac" : s.label === "Expenditures" ? "#fca5a5" : "#94a3b8"
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Middle: Charts and quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-4 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Revenue vs Expenditures</div>
            <span className="text-xs text-gray-500">This Year</span>
          </div>
          <div className="mt-3">
            <BarChart
              labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}
              series={[
                { name: "Revenue", values: [10,12,9,13,14,18,15,17,16,20,19,22], color: "#86efac" },
                { name: "Expenditures", values: [6,7,8,7,9,10,11,10,9,12,11,13], color: "#fca5a5" },
              ]}
              width={760}
              height={240}
            />
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-4 shadow-sm">
          <div className="font-semibold mb-2">Order Status</div>
          <DonutChart data={orderBreakdown} />
        </div>
      </div>

      {/* Bottom: Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-4 shadow-sm">
          <div className="font-semibold mb-3">Low Stock Alerts</div>
          <ul className="divide-y divide-gray-100 dark:divide-neutral-800">
            {lowStock.map((x) => (
              <li key={x.name} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-800 dark:text-gray-200">{x.name}</span>
                <span className="text-xs rounded bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5">{x.qty} left</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-4 shadow-sm">
          <div className="font-semibold mb-3">Quick Actions</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "New Item", to: "/items" },
              { label: "Record Stock", to: "/stock" },
              { label: "New Order", to: "/orders" },
              { label: "Expenditure", to: "/expenditures" },
            ].map((a) => (
              <a
                key={a.label}
                href={a.to}
                className="rounded-lg border border-gray-200 dark:border-neutral-800 px-3 py-3 text-center text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
              >
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

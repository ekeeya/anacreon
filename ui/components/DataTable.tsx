"use client";

import React from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
}

export default function DataTable<T>({ columns, data, emptyText = "No data" }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
        <thead className="bg-gray-50 dark:bg-neutral-900/60">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 ${c.className || ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
          {data.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-neutral-800/60">
                {columns.map((c) => (
                  <td key={String(c.key)} className={`px-4 py-3 text-sm text-gray-800 dark:text-gray-200 ${c.className || ""}`}>
                    {c.render ? c.render(row) : (row as any)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}



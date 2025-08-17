"use client";

import React, { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { api } from "@/lib/api";

interface StockDto {
  id: number;
  item: number;
  quantity: number;
  price: string;
  recorded_at?: string;
}

export default function StockPage() {
  const [rows, setRows] = useState<StockDto[]>([]);

  const columns: Column<StockDto>[] = [
    { key: "item", header: "Item" },
    { key: "quantity", header: "Qty" },
    { key: "price", header: "Price" },
    { key: "recorded_at", header: "Recorded", render: (r) => (r.recorded_at ? new Date(r.recorded_at).toLocaleString() : "-") },
  ];

  async function load() {
    try {
      const data = await api.get<StockDto[]>("/stock");
      setRows(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Stock</h1>
      </div>
      <DataTable columns={columns} data={rows} emptyText="No stock records" />
    </div>
  );
}



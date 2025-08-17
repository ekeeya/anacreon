"use client";

import React, { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { api } from "@/lib/api";

interface OrderItemDto {
  item: number;
  quantity: number;
  selling_price: string;
}

interface OrderDto {
  id: number;
  status: string;
  total: string;
  placed_at: string;
}

export default function OrdersPage() {
  const [rows, setRows] = useState<OrderDto[]>([]);

  const columns: Column<OrderDto>[] = [
    { key: "id", header: "#" },
    { key: "status", header: "Status" },
    { key: "total", header: "Total" },
    { key: "placed_at", header: "Placed", render: (r) => new Date(r.placed_at).toLocaleString() },
  ];

  async function load() {
    try {
      const data = await api.get<OrderDto[]>("/orders");
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
        <h1 className="text-xl font-semibold">Orders</h1>
      </div>
      <DataTable columns={columns} data={rows} emptyText="No orders yet" />
    </div>
  );
}



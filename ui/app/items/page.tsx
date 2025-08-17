"use client";

import React, { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import { api } from "@/lib/api";

interface ItemDto {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  cost_price: string;
  last_selling_price: string;
  category?: number | null;
  subcategory?: number | null;
}

export default function ItemsPage() {
  const [items, setItems] = useState<ItemDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Partial<ItemDto>>({});
  const [loading, setLoading] = useState(false);

  const columns: Column<ItemDto>[] = [
    { key: "name", header: "Name" },
    { key: "sku", header: "SKU" },
    { key: "quantity", header: "Quantity" },
    { key: "cost_price", header: "Cost" },
    { key: "last_selling_price", header: "Last Price" },
  ];

  async function load() {
    try {
      const data = await api.get<ItemDto[]>("/items");
      setItems(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({});
    setIsOpen(true);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/items", form);
      setIsOpen(false);
      await load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Items</h1>
        <button onClick={openCreate} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          New Item
        </button>
      </div>

      <DataTable columns={columns} data={items} emptyText="No items yet" />

      <Modal title="New Item" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
              value={form.name || ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">SKU</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
              value={form.sku || ""}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Quantity</label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
                value={form.quantity ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value || "0", 10) }))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Cost Price</label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
                value={form.cost_price as any}
                onChange={(e) => setForm((f) => ({ ...f, cost_price: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Last Selling Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
              value={form.last_selling_price as any}
              onChange={(e) => setForm((f) => ({ ...f, last_selling_price: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-md px-3 py-2 border border-gray-300 dark:border-neutral-700">
              Cancel
            </button>
            <button disabled={loading} type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}



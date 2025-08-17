"use client";

import React, { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import { api } from "@/lib/api";

interface ExpenditureDto {
  id: number;
  amount: string;
  description: string;
  category: string;
  spent_by: number | null;
  spent_at: string;
}

export default function ExpendituresPage() {
  const [rows, setRows] = useState<ExpenditureDto[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<ExpenditureDto>>({});
  const [loading, setLoading] = useState(false);

  const columns: Column<ExpenditureDto>[] = [
    { key: "amount", header: "Amount" },
    { key: "category", header: "Category" },
    { key: "description", header: "Description" },
    { key: "spent_at", header: "Date", render: (r) => new Date(r.spent_at).toLocaleString() },
  ];

  async function load() {
    try {
      const data = await api.get<ExpenditureDto[]>("/expenditures");
      setRows(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/expenditures", form);
      setOpen(false);
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
        <h1 className="text-xl font-semibold">Expenditures</h1>
        <button onClick={() => setOpen(true)} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Record Expenditure
        </button>
      </div>
      <DataTable columns={columns} data={rows} emptyText="No expenditures yet" />

      <Modal title="Record Expenditure" isOpen={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
                value={form.amount as any}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
                value={form.category || ""}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800"
              value={form.description || ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 border border-gray-300 dark:border-neutral-700">
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



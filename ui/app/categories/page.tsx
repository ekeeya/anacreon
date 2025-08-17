"use client";

import React, { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import { api } from "@/lib/api";

interface CategoryDto {
  id: number;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [rows, setRows] = useState<CategoryDto[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<CategoryDto>>({});
  const [loading, setLoading] = useState(false);

  const columns: Column<CategoryDto>[] = [
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
  ];

  async function load() {
    try {
      const data = await api.get<CategoryDto[]>("/categories");
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
      await api.post("/categories", form);
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
        <h1 className="text-xl font-semibold">Categories</h1>
        <button onClick={() => setOpen(true)} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          New Category
        </button>
      </div>
      <DataTable columns={columns} data={rows} emptyText="No categories yet" />

      <Modal title="New Category" isOpen={open} onClose={() => setOpen(false)}>
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



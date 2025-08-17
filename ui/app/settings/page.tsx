"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import Modal from "@/components/Modal";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { dummyBusinesses, dummyUsers, dummyIntegrations, dummyExpenditureCategories } from "@/data/settings";
import { TextInput, TextArea, SearchableSelect, Checkbox, Radio } from "@/components/forms/Inputs";

type TabKey =
  | "general"
  | "inventory"
  | "orders"
  | "finance"
  | "expenditure"
  | "users_roles"
  | "businesses"
  | "audit"
  | "integrations";

const tabs: { key: TabKey; label: string }[] = [
  { key: "general", label: "General" },
  { key: "inventory", label: "Inventory" },
  { key: "orders", label: "Orders & Fulfillment" },
  { key: "finance", label: "Finance & Tax" },
  { key: "expenditure", label: "Expenditure" },
  { key: "users_roles", label: "Users & Roles" },
  { key: "businesses", label: "Businesses" },
  { key: "audit", label: "Audit & Logs" },
  { key: "integrations", label: "Integrations" },
];

interface BusinessDto {
  id: number;
  name: string;
  description?: string;
  is_active?: boolean;
  created_on?: string;
}

export default function SettingsPage() {
  const [active, setActive] = useState<TabKey>("general");

  // Businesses state (dummy)
  const [businesses, setBusinesses] = useState<BusinessDto[]>(dummyBusinesses);
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState<BusinessDto | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BusinessDto | null>(null);
  const [form, setForm] = useState<Partial<BusinessDto>>({});

  const bizColumns: Column<BusinessDto>[] = useMemo(
    () => [
      { key: "name", header: "Name" },
      { key: "description", header: "Description" },
      {
        key: "is_active",
        header: "Status",
        render: (r) => (
          <span className={`text-xs rounded px-2 py-0.5 ${r.is_active ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300"}`}>
            {r.is_active ? "Active" : "Disabled"}
          </span>
        ),
      },
      {
        key: "created_on",
        header: "Created",
        render: (r) => (r.created_on ? new Date(r.created_on).toLocaleDateString() : "-"),
      },
      {
        key: "actions",
        header: "Actions",
        render: (r) => (
          <div className="flex items-center gap-2">
            <button
              className="text-xs rounded border px-2 py-1 hover:bg-gray-50 dark:hover:bg-neutral-800"
              onClick={() => setOpenEdit(r)}
              title="Edit"
            >
              <span className="inline-flex items-center gap-1"><MdModeEditOutline /> Edit</span>
            </button>
            <button
              className="text-xs rounded border px-2 py-1 hover:bg-gray-50 dark:hover:bg-neutral-800"
              onClick={() => toggleActive(r)}
              title={r.is_active ? "Disable" : "Enable"}
            >
              {r.is_active ? "Disable" : "Enable"}
            </button>
            <button
              className="text-xs rounded border px-2 py-1 hover:bg-red-50 text-red-600 dark:hover:bg-red-900/30"
              onClick={() => setConfirmDelete(r)}
              title="Delete"
            >
              <span className="inline-flex items-center gap-1"><MdDeleteOutline /> Delete</span>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  function createBusiness(e: React.FormEvent) {
    e.preventDefault();
    const next: BusinessDto = {
      id: Math.max(0, ...businesses.map((b) => b.id)) + 1,
      name: (form.name || "Untitled") as string,
      description: form.description,
      is_active: true,
      created_on: new Date().toISOString(),
    };
    setBusinesses((prev) => [next, ...prev]);
    setOpenNew(false);
    setForm({});
  }

  function saveBusiness(e: React.FormEvent) {
    e.preventDefault();
    if (!openEdit) return;
    setBusinesses((prev) => prev.map((b) => (b.id === openEdit.id ? { ...b, ...form } : b)));
    setOpenEdit(null);
    setForm({});
  }

  function toggleActive(row: BusinessDto) {
    setBusinesses((prev) => prev.map((b) => (b.id === row.id ? { ...b, is_active: !b.is_active } : b)));
  }

  function deleteBusiness(id: number) {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    setConfirmDelete(null);
  }

  // Local UI state for selects (using SearchableSelect)
  const currencyOptions = useMemo(() => [
    { value: "USD", label: "USD" },
    { value: "UGX", label: "UGX" },
    { value: "EUR", label: "EUR" },
  ], []);
  const yesNoOptions = useMemo(() => [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ], []);
  const statusOptions = useMemo(() => [
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
  ], []);
  const [generalCurrency, setGeneralCurrency] = useState<string>("USD");
  const [inventoryItemProps, setInventoryItemProps] = useState<string>("Yes");
  const [orderDefaultStatus, setOrderDefaultStatus] = useState<string>("Pending");
  const [orderEnableCancel, setOrderEnableCancel] = useState<string>("Yes");

  // Expenditure categories (dummy)
  type Cat = { id: number; name: string; description?: string; is_active: boolean };
  const [categories, setCategories] = useState<Cat[]>(dummyExpenditureCategories);
  const [catOpen, setCatOpen] = useState(false);
  const [catEdit, setCatEdit] = useState<Cat | null>(null);
  const [catForm, setCatForm] = useState<Partial<Cat>>({});

  const catCols: Column<Cat>[] = [
    { key: "name", header: "Name" },
    { key: "description", header: "Description" },
    { key: "is_active", header: "Active", render: (r) => (r.is_active ? "Yes" : "No") },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex items-center gap-2">
          <button className="text-xs rounded border px-2 py-1 hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => setCatEdit(r)}>Edit</button>
          <button className="text-xs rounded border px-2 py-1 hover:bg-red-50 text-red-600 dark:hover:bg-red-900/30" onClick={() => setCategories((prev) => prev.filter((c) => c.id !== r.id))}>Delete</button>
        </div>
      ),
    },
  ];

  function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (catEdit) {
      setCategories((prev) => prev.map((c) => (c.id === catEdit.id ? { ...c, ...catForm } : c)));
      setCatEdit(null);
    } else {
      const next: Cat = {
        id: Math.max(0, ...categories.map((c) => c.id)) + 1,
        name: (catForm.name || "Untitled") as string,
        description: catForm.description,
        is_active: Boolean(catForm.is_active ?? true),
      };
      setCategories((prev) => [next, ...prev]);
      setCatOpen(false);
    }
    setCatForm({});
  }

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      {/* Vertical Tabs */}
      <aside className="md:w-56 md:flex-shrink-0">
        <nav className="space-y-1 sticky top-16">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${
                active === t.key
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-neutral-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <section className="flex-1 space-y-6">
        {active === "general" && (
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 transition-all animate-fadein">
            <h2 className="text-lg font-semibold mb-2">General</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="App Name" defaultValue="Anacreon" />
              <SearchableSelect label="Default Currency" options={currencyOptions} value={generalCurrency} onChange={(v) => setGeneralCurrency(String(v))} />
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">Brand Color</label>
                <input type="color" defaultValue="#2563eb" className="h-10 w-20 rounded-md border border-gray-300 dark:border-neutral-700" />
              </div>
            </div>
          </div>
        )}

        {active === "inventory" && (
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 transition-all animate-fadein">
            <h2 className="text-lg font-semibold mb-2">Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Low Stock Threshold" type="number" defaultValue={5} />
              <SearchableSelect label="Enable Item Properties" options={yesNoOptions} value={inventoryItemProps} onChange={(v) => setInventoryItemProps(String(v))} />
            </div>
          </div>
        )}

        {active === "orders" && (
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 transition-all animate-fadein">
            <h2 className="text-lg font-semibold mb-2">Orders & Fulfillment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SearchableSelect label="Default Order Status" options={statusOptions} value={orderDefaultStatus} onChange={(v) => setOrderDefaultStatus(String(v))} />
              <SearchableSelect label="Enable Cancellations" options={yesNoOptions} value={orderEnableCancel} onChange={(v) => setOrderEnableCancel(String(v))} />
            </div>
          </div>
        )}

        {active === "finance" && (
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 transition-all animate-fadein">
            <h2 className="text-lg font-semibold mb-2">Finance & Tax</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Tax Rate (%)" type="number" defaultValue={18} />
              <SearchableSelect label="Default Currency" options={currencyOptions} value={generalCurrency} onChange={(v) => setGeneralCurrency(String(v))} />
            </div>
          </div>
        )}

        {active === "expenditure" && (
          <div className="space-y-4 transition-all animate-fadein">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Expenditure Categories</h2>
              <button onClick={() => { setCatForm({}); setCatOpen(true); }} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">New Category</button>
            </div>
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-4">
              <DataTable columns={catCols} data={categories} emptyText="No categories" />
            </div>
          </div>
        )}

        {active === "users_roles" && (
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 transition-all animate-fadein">
            <h2 className="text-lg font-semibold mb-2">Users & Roles</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-neutral-800">
                <thead className="bg-gray-50 dark:bg-neutral-900/60 text-xs">
                  <tr>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyUsers.map((u) => (
                    <tr key={u.id} className="divide-x divide-gray-100 dark:divide-neutral-800">
                      <td className="px-4 py-2 text-sm">{u.username}</td>
                      <td className="px-4 py-2 text-sm">{u.email}</td>
                      <td className="px-4 py-2 text-sm">{u.role}</td>
                      <td className="px-4 py-2 text-sm">{u.is_active ? "Active" : "Disabled"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {active === "businesses" && (
          <div className="space-y-4 transition-all animate-fadein">
            <div className="flex items_CENTER justify-between">
              <h2 className="text-lg font-semibold">Businesses</h2>
              <button onClick={() => { setForm({}); setOpenNew(true); }} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">New Business</button>
            </div>
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-4">
              <DataTable columns={bizColumns} data={businesses} emptyText={"No businesses"} />
            </div>
          </div>
        )}

        {active === "audit" && (
          <div className="rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 transition-all animate-fadein">
            <h2 className="text-lg font-semibold mb-2">Audit & Logs</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300">Display audit trails, filters, and export actions here (dummy).</div>
          </div>
        )}

        {active === "integrations" && (
          <div className="rounded-xl bg_WHITE dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 transition-all animate-fadein">
            <h2 className="text-lg font-semibold mb-2">Integrations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {dummyIntegrations.map((it) => (
                <div key={it.id} className="rounded-lg border border-gray-200 dark:border-neutral-800 p-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs mt-1 text-gray-500">{it.status}</div>
                  <button className="mt-3 text-xs rounded-md border px-3 py-1 hover:bg-gray-100 dark:hover:bg-neutral-800">Manage</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Modals: New Business */}
      <Modal title="New Business" isOpen={openNew} onClose={() => setOpenNew(false)}>
        <form onSubmit={createBusiness} className="space-y-3">
          <TextInput label="Name" value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: (e.target as HTMLInputElement).value }))} required />
          <TextArea label="Description" value={form.description || ""} onChange={(e) => setForm((f) => ({ ...f, description: (e.target as HTMLTextAreaElement).value }))} />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpenNew(false)} className="rounded-md px-3 py-2 border border-gray-300 dark:border-neutral-700">Cancel</button>
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text_WHITE hover:bg-blue-700">Save</button>
          </div>
        </form>
      </Modal>

      {/* Modals: Edit Business */}
      <Modal title="Edit Business" isOpen={!!openEdit} onClose={() => setOpenEdit(null)}>
        <form onSubmit={saveBusiness} className="space-y-3">
          <TextInput label="Name" value={form.name ?? openEdit?.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: (e.target as HTMLInputElement).value }))} required />
          <TextArea label="Description" value={form.description ?? openEdit?.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: (e.target as HTMLTextAreaElement).value }))} />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpenEdit(null)} className="rounded-md px-3 py-2 border border-gray-300 dark:border-neutral-700">Cancel</button>
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text_WHITE hover:bg-blue-700">Save</button>
          </div>
        </form>
      </Modal>

      {/* Modals: Confirm Delete */}
      <Modal title="Delete Business" isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div className="space-y-3">
          <p className="text-sm">Are you sure you want to delete <span className="font-semibold">{confirmDelete?.name}</span>? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setConfirmDelete(null)} className="rounded-md px-3 py-2 border border-gray-300 dark:border-neutral-700">Cancel</button>
            <button onClick={() => confirmDelete && deleteBusiness(confirmDelete.id)} className="rounded-md bg-red-600 px-4 py-2 text_WHITE hover:bg-red-700">Delete</button>
          </div>
        </div>
      </Modal>

      {/* Modals: Category */}
      <Modal title={catEdit ? "Edit Category" : "New Category"} isOpen={catOpen || !!catEdit} onClose={() => { setCatOpen(false); setCatEdit(null); }}>
        <form onSubmit={saveCategory} className="space-y-3">
          <TextInput label="Name" value={catForm.name ?? catEdit?.name ?? ""} onChange={(e) => setCatForm((f) => ({ ...f, name: (e.target as HTMLInputElement).value }))} required />
          <TextArea label="Description" value={catForm.description ?? catEdit?.description ?? ""} onChange={(e) => setCatForm((f) => ({ ...f, description: (e.target as HTMLTextAreaElement).value }))} />
          <div className="flex items-center gap-3">
            <Checkbox checked={Boolean(catForm.is_active ?? catEdit?.is_active ?? true)} onChange={(e) => setCatForm((f) => ({ ...f, is_active: (e.target as HTMLInputElement).checked }))} label="Active" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setCatOpen(false); setCatEdit(null); }} className="rounded-md px-3 py-2 border border-gray-300 dark;border-neutral-700">Cancel</button>
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text_WHITE hover:bg-blue-700">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}



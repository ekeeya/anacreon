"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export function TextInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div>
      {label && <label className="block text-sm mb-1">{label}</label>}
      <input
        {...props}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 ${props.className || ""}`}
      />
    </div>
  );
}

export function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div>
      {label && <label className="block text-sm mb-1">{label}</label>}
      <textarea
        {...props}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800 ${props.className || ""}`}
      />
    </div>
  );
}

export function Checkbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" {...props} className="h-4 w-4 rounded border-gray-300 dark:border-neutral-700" />
      {label}
    </label>
  );
}

export function Radio({ label, name, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; name: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="radio" name={name} {...props} className="h-4 w-4 rounded-full border-gray-300 dark:border-neutral-700" />
      {label}
    </label>
  );
}

type Option = { value: string | number; label: string };

export function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
}: {
  label?: string;
  options: Option[];
  value?: string | number;
  onChange?: (v: string | number) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  const filtered = useMemo(() => {
    if (!query) return options;
    return options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [query, options]);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-sm mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-left dark:border-neutral-700 dark:bg-neutral-800"
      >
        {selectedLabel || <span className="text-gray-400">{placeholder}</span>}
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          <div className="p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          <ul className="max-h-56 overflow-auto py-1">
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">No results</li>}
            {filtered.map((o) => (
              <li key={String(o.value)}>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}



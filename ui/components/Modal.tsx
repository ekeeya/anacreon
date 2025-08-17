"use client";

import React from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-lg dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 animate-fadein">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-neutral-800">
            <span className="sr-only">Close</span>
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}



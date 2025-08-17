"use client";

import React, { useEffect, useState } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { api } from "@/lib/api";

interface UserDto {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
}

export default function UsersPage() {
  const [rows, setRows] = useState<UserDto[]>([]);

  const columns: Column<UserDto>[] = [
    { key: "username", header: "Username" },
    { key: "email", header: "Email" },
    { key: "is_active", header: "Active", render: (r) => (r.is_active ? "Yes" : "No") },
  ];

  async function load() {
    try {
      const data = await api.get<UserDto[]>("/business-users");
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
        <h1 className="text-xl font-semibold">Users</h1>
      </div>
      <DataTable columns={columns} data={rows} emptyText="No users" />
    </div>
  );
}


